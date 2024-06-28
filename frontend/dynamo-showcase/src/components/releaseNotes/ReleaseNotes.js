import React from 'react';
import {Grid, Divider, CardContent} from '@mui/material';
import {Card, Text} from 'glide-design-system';
import logo from '../../assets/logo/Dynamo_White_Logo.png';

const releaseNotes = [
  {
    month: 'June 2024',
    releases: [
      {
            version: '2.7.0',
            releaseDate: 'June 26, 2024',
            added: ['Updated Spring AI version.'],
      }
    ]
  },
  {
    month: 'May 2024',
    releases: [
      {
            version: '2.6.0',
            releaseDate: 'May 30, 2024',
            added: ['Added AI Module using Spring AI.'],
      },
      {
        version: '2.5.2',
        releaseDate: 'May 29, 2024',
        added: ['Form Elements Added - Heading, Divider and Paragraph '],
      },
      {
        version: '2.5.1',
        releaseDate: 'May 22, 2024',
        added: ['Dynamo Forms Bug Fix'],
      },
      {
        version: '2.5.0',
        releaseDate: 'May 17, 2024',
        added: ['Dynamo UI Refresh'],
      },
    ],
  },
  {
    month: 'April 2024',
    releases: [
      {
        version: '2.4.0',
        releaseDate: 'April 24, 2024',
        added: [
          'Added Dynamo Docs Module for create, update, retrieve, delete, upload and download Markdown(md) docs using commonmark library.',
        ],
      },
      {
        version: '2.3.0',
        releaseDate: 'April 24, 2024',
        added: [
          'Migrated Form Builder form BPMN JS to Glide based form builder',
          'Updated responses table to display responses as columns',
        ],
      },
      {
        version: '2.2.0',
        releaseDate: 'April 02, 2024',
        added: ['Secure Publish Form', 'List of user invites'],
      },
    ],
  },
  {
    month: 'March 2024',
    releases: [
      {
        version: '2.1.0',
        releaseDate: 'March 21, 2024',
        added: ['List of user responses', 'Publish form with shareable  ink'],
      },
    ],
  },
  {
    month: 'November 2023',
    releases: [
      {
        version: '2.0.0',
        releaseDate: 'November 03, 2023',
        added: ['BPMN Workflow'],
      },
    ],
  },
  {
    month: 'September 2023',
    releases: [
      {
        version: '1.1.0',
        releaseDate: 'September 23, 2023',
        added: ['Create, Edit, View Forms'],
      },
    ],
  },
  {
    month: 'August 2023',
    releases: [
      {
        version: '1.0.0',
        releaseDate: 'August 31, 2023',
        added: ['User Management'],
      },
    ],
  },
];

export default function ReleaseNotes() {
  return (
    <Grid container>
      <Grid
        item
        xs={12}
        sx={{padding: '20px 20px 0px 20px', backgroundColor: '#1b3764'}}>
        <img
          src={logo}
          alt="logo"
          height="50px"
          width="110px"
          style={{borderRadius: '5px'}}
        />
      </Grid>

      <Grid
        item
        container
        xs={12}
        textAlign="center"
        paddingBottom={2}
        sx={{backgroundColor: '#1b3764'}}>
        <Grid item xs={12}>
          <Text style={{textAlign: 'center', color: 'white'}} type="h1">
            Release Notes
          </Text>
        </Grid>
      </Grid>

      <Grid
        item
        container
        xs={12}
        md={8}
        margin="auto"
        spacing={2}
        marginBottom={2}>
        {releaseNotes?.map(releaseNote => {
          return (
            <Grid item xs={12}>
              <Divider style={{marginBottom: '10px'}}>
                {releaseNote.month}
              </Divider>
              <Grid item xs={12} container>
                <Grid item xs={12}>
                  {releaseNote.releases.map(release => {
                    return (
                      <div style={{marginBottom: '10px'}}>
                        <Card
                          style={{
                            boxShadow: 'none',
                            padding: '0',
                            border: '1px solid rgba(0, 0, 0, 0.12)',
                            borderRadius: '5px',
                            margin: '0',
                            marginTop: '10px',
                          }}>
                          <CardContent style={{paddingBottom: '16px'}}>
                            <Text type="h1">Dynamo v{release.version}</Text>
                            <Text>{release.releaseDate}</Text>
                            {release.added.length > 0 && (
                              <Grid container spacing={1} marginTop={1}>
                                <Grid
                                  item
                                  xs={12}
                                  display="flex"
                                  alignItems="center">
                                  <span
                                    className="material-symbols-outlined"
                                    style={{
                                      backgroundColor: '#1b3764',
                                      color: 'white',
                                      borderRadius: '5px',
                                    }}>
                                    add
                                  </span>
                                  <Text
                                    type="h3"
                                    style={{
                                      marginLeft: '5px',
                                      fontWeight: '700',
                                    }}>
                                    Added
                                  </Text>
                                </Grid>
                                <Grid item xs={12}>
                                  <ul>
                                    {release.added.map(feature => (
                                      <li>
                                        <Text type="h3">{feature}</Text>
                                      </li>
                                    ))}
                                  </ul>
                                </Grid>
                              </Grid>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    );
                  })}
                </Grid>
              </Grid>
            </Grid>
          );
        })}
      </Grid>
    </Grid>
  );
}
