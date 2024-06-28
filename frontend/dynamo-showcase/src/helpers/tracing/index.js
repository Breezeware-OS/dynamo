import {context, trace, Span, SpanStatusCode} from '@opentelemetry/api';
import {WebTracerProvider} from '@opentelemetry/sdk-trace-web';
import {Resource} from '@opentelemetry/resources';
import {SimpleSpanProcessor} from '@opentelemetry/sdk-trace-base';
import {OTLPTraceExporter} from '@opentelemetry/exporter-trace-otlp-http';
import {ZoneContextManager} from '@opentelemetry/context-zone';
import {FetchInstrumentation} from '@opentelemetry/instrumentation-fetch';
import {registerInstrumentations} from '@opentelemetry/instrumentation';
import {SeverityNumber} from '@opentelemetry/api-logs';
import {
  LoggerProvider,
  BatchLogRecordProcessor,
  LogRecord,
} from '@opentelemetry/sdk-logs';
import {OTLPLogExporter} from '@opentelemetry/exporter-logs-otlp-http';

const serviceName = 'dynamo-showcase-web';
const OTEL_COLLECTOR_URL = process.env.REACT_APP_DYNAMO_OTEL_URL;

const resource = new Resource({'service.name': serviceName});
const provider = new WebTracerProvider({resource});
const collector = new OTLPTraceExporter({
  url: `${OTEL_COLLECTOR_URL}/traces`,
});

provider.addSpanProcessor(new SimpleSpanProcessor(collector));
provider.register({contextManager: new ZoneContextManager()});

const webTracerWithZone = provider.getTracer(serviceName);
let bindingSpan;

window.startBindingSpan = function (traceId, spanId, traceFlags) {
  bindingSpan = webTracerWithZone.startSpan('');
  bindingSpan.spanContext().traceId = traceId;
  bindingSpan.spanContext().spanId = spanId;
  bindingSpan.spanContext().traceFlags = traceFlags;
};

registerInstrumentations({
  instrumentations: [
    new FetchInstrumentation({
      propagateTraceHeaderCorsUrls: ['/.*/g'],
      clearTimingResources: true,
      applyCustomAttributesOnSpan: function (span, request, result) {
        const attributes = span.attributes;
        if (attributes.component === 'fetch') {
          span.updateName(
            `${attributes['http.method']} ${attributes['http.url']}`,
          );
        }
        if (result instanceof Error) {
          span.setStatus({
            code: SpanStatusCode.ERROR,
            message: result.message,
          });
          span.recordException(result.stack || result.name);
        }
      },
    }),
  ],
});

export function traceSpan(name, func) {
  let singleSpan;
  if (bindingSpan) {
    const ctx = trace.setSpan(context.active(), bindingSpan);
    singleSpan = webTracerWithZone.startSpan(name, undefined, ctx);
    bindingSpan = undefined;
  } else {
    singleSpan = webTracerWithZone.startSpan(name);
  }
  return context.with(trace.setSpan(context.active(), singleSpan), () => {
    try {
      const result = func();
      singleSpan.end();
      return result;
    } catch (error) {
      singleSpan.setStatus({code: SpanStatusCode.ERROR});
      singleSpan.end();
      throw error;
    }
  });
}

// exporter options. see all options in OTLPExporterConfigBase
const collectorOptions = {
  url: `${OTEL_COLLECTOR_URL}/logs`, // url is optional and can be omitted - default is http://localhost:4318/v1/logs
  headers: {}, // an optional object containing custom headers to be sent with each request
  concurrencyLimit: 1, // an optional limit on pending requests
};
const logExporter = new OTLPLogExporter(collectorOptions);
const loggerProvider = new LoggerProvider({
  resource: new Resource({'service.name': serviceName}),
});

loggerProvider.addLogRecordProcessor(new BatchLogRecordProcessor(logExporter));

const logger = loggerProvider.getLogger('default', '1.0.0');
// Emit a log
export async function logError(severityText, body) {
  logger.emit({
    severityNumber: SeverityNumber.ERROR,
    severityText: severityText,
    body: JSON.stringify(body),
    // attributes: {'log.type': 'custom'},
  });
}

export async function loginfo(severityText, body) {
  logger.emit({
    severityNumber: SeverityNumber.INFO,
    severityText: severityText,
    body: JSON.stringify(body),
    // attributes: {'log.type': 'custom'},
  });
}

export async function logdebug(severityText, body) {
  logger.emit({
    severityNumber: SeverityNumber.DEBUG,
    severityText: severityText,
    body: JSON.stringify(body),

    // attributes: {'log.type': 'custom'},
  });
}
