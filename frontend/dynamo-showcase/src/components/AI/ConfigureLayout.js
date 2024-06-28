import React from 'react';
import {makeStyles} from '@material-ui/core';
import {Slider, IconButton} from '@mui/material';
import {Text, TextField, Divider} from 'glide-design-system';

const ConfigureLayout = ({
  temperature,
  setTemperature,
  topK,
  setTopK,
  topP,
  setTopP,
}) => {
  const classes = useStyles();

  function SliderValueLabel({children}) {
    return <span className={classes.valueLabel}>{children}</span>;
  }

  return (
    <div className={classes.container}>
      <div>
        <Text className={classes.header}>Temperature</Text>
        <div className={classes.info}>
          <span
            style={{fontSize: '20px'}}
            className="material-symbols-outlined">
            info
          </span>
          <div>
            The temperature of the model. Increasing the temperature will make
            the model answer more creatively.
          </div>
        </div>
        <div style={{width: '100%', display: 'flex', marginBlock: '12px'}}>
          <Slider
            aria-label="Temperature"
            defaultValue={0}
            value={temperature}
            step={0.01}
            min={0}
            marks
            max={1}
            slots={{valueLabel: SliderValueLabel}}
            onChange={e => setTemperature(e.target.value)}
            slotProps={{
              thumb: {
                className: classes.thumb,
              },
              mark: {
                className: `${classes.mark} ${classes.markActive}`,
              },
              track: {className: classes.track},
              rail: {className: classes.rail},
            }}
            className={classes.slider}
          />
          <TextField
            onChange={e => {
              if (e.target.value > 1) {
                setTemperature(1);
              } else setTemperature(e.target.value);
            }}
            width="38px"
            min={0}
            max={1}
            value={temperature}
            containerClass={classes.searchField}
            type="number"
          />
        </div>
      </div>
      <Divider style={{borderTopWidth: '3px'}} />
      <div>
        <Text className={classes.header}>Top-K</Text>
        <div className={classes.info}>
          <span
            style={{fontSize: '20px'}}
            className="material-symbols-outlined">
            info
          </span>
          <div>
            Reduces the probability of generating nonsense. A higher value
            (e.g., 100) will give more diverse answers, while a lower value
            (e.g., 10) will be more conservative.
          </div>
        </div>
        <div style={{width: '100%', display: 'flex', marginBlock: '12px'}}>
          <Slider
            aria-label="Temperature"
            defaultValue={0}
            value={topK}
            step={1}
            min={0}
            marks
            max={100}
            slots={{valueLabel: SliderValueLabel}}
            onChange={e => setTopK(e.target.value)}
            slotProps={{
              thumb: {
                className: classes.thumb,
              },
              mark: {
                className: `${classes.mark} ${classes.markActive}`,
              },
              track: {className: classes.track},
              rail: {className: classes.rail},
            }}
            className={classes.slider}
          />
          <TextField
            onChange={e => {
              if (e.target.value > 100) {
                setTopK(100);
              } else setTopK(e.target.value);
            }}
            width="38px"
            min={0}
            max={100}
            value={topK}
            containerClass={classes.searchField}
            type="number"
          />
        </div>
      </div>
      <Divider style={{borderTopWidth: '3px'}} />
      <div>
        <Text className={classes.header}>Top-P</Text>
        <div className={classes.info}>
          <span
            style={{fontSize: '20px'}}
            className="material-symbols-outlined">
            info
          </span>
          <div>
            Works together with top-k. A higher value (e.g., 0.95) will lead to
            more diverse text, while a lower value (e.g., 0.5) will generate
            more focused and conservative text.
          </div>
        </div>
        <div style={{width: '100%', display: 'flex', marginBlock: '12px'}}>
          <Slider
            aria-label="Temperature"
            defaultValue={0}
            value={topP}
            step={0.01}
            min={0}
            marks
            max={1}
            slots={{valueLabel: SliderValueLabel}}
            onChange={e => setTopP(e.target.value)}
            slotProps={{
              thumb: {
                className: classes.thumb,
              },
              mark: {
                className: `${classes.mark} ${classes.markActive}`,
              },
              track: {className: classes.track},
              rail: {className: classes.rail},
            }}
            className={classes.slider}
          />
          <TextField
            onChange={e => {
              if (e.target.value > 1) {
                setTopP(1);
              } else setTopP(e.target.value);
            }}
            width="38px"
            min={0}
            max={1}
            value={topP}
            containerClass={classes.searchField}
            type="number"
          />
        </div>
      </div>
    </div>
  );
};

export default ConfigureLayout;

const useStyles = makeStyles(theme => ({
  container: {
    width: '100% !important',
    boxShadow: '0px 0px 5px 0px rgba(0, 0, 0, 0.35) !important',
    borderRadius: '5px',
    padding: '16px',
  },
  header: {
    color: '#8a8a8a !important',
    fontSize: '16px !important',
    fontWeight: '500 !important',
    fontFamily: '"Roboto Medium", "Roboto", sans-serif !important',
  },
  info: {
    padding: '12px',
    backgroundColor: '#f5f9ff',
    borderLeft: '2px solid #1b3764',
    color: '#1b3764',
    display: 'flex',
    borderRadius: '5px',
    boxShadow: '0px 0px 5px 0px rgba(0, 0, 0, 0.35) !important',
    marginTop: '12px',
  },
  thumb: {
    backgroundColor: '#1b3764 !important',
    '&:hover': {
      boxShadow: '0px 0px 0px 0px transparent !important',
    },
  },
  mark: {
    display: 'none !important',
  },
  slider: {
    padding: '0 !important',
    marginBlock: '16px !important',
    display: 'flex !important',
    flex: '1 !important',
    marginRight: '12px !important',
  },
  rail: {
    display: 'block !important',
    position: 'absolute !important',
    width: '100% !important',
    height: '10px !important',
    borderRadius: '6px !important',
    backgroundColor: '#fff !important',
    opacity: '1 !important',
    border: '1px solid #d7d7d7 !important',
  },
  markActive: {
    backgroundColor: '#1b3764 !important',
  },
  valueLabel: {
    fontWeight: '600 !important',
    fontSize: '12px !important',
    position: 'relative !important',
    top: '-2em !important',
    textAlign: 'center !important',
    alignSelf: 'center !important',
  },
  track: {
    display: 'block !important',
    position: 'absolute !important',
    height: '10px !important',
    borderRadius: '6px !important',
    backgroundColor: '#1b3764 !important',
  },
  searchField: {
    color: 'grey !important',
    width: '38px !important',
    height: '33px !important',
    paddingInline: '0px !important',
  },
}));
