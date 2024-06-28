import React, {useState} from 'react';
import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import ArrowDropDownCircleOutlinedIcon from '@mui/icons-material/ArrowDropDownCircleOutlined';

export default function GlideComponentButtons({
  addComponentsHandler,
  setIsNewComponentDragging,
}) {
  const theme = useTheme();
  const isMedium = useMediaQuery(theme.breakpoints.down('lg'));

  const [expandedElements, setExpandedElments] = useState([
    'basic',
    'inputs',
    'selection',
  ]);

  const handleExpandedElementsChange = panel => (event, isExpanded) => {
    if (isExpanded) {
      setExpandedElments([...expandedElements, panel]);
    } else {
      let currentExpandedElements = expandedElements.filter(
        ele => ele !== panel,
      );
      setExpandedElments(currentExpandedElements);
    }
  };

  return (
    <div
      style={{
        height: isMedium ? 'auto' : '700px',
        overflow: 'auto',
      }}>
      <div
        style={
          {
            // paddingLeft: '6%',
          }
        }>
        <Typography sx={{fontWeight: 600, color: '#999999'}} variant="h5">
          Elements
        </Typography>
        <Divider sx={{borderWidth: 2, borderColor: '#ececec', width: '94%'}} />
      </div>

      <Accordion
        onChange={handleExpandedElementsChange('basic')}
        expanded={expandedElements.includes('basic')}
        sx={{border: 'none', boxShadow: 'none', padding: 0, width: '97%'}}>
        <AccordionSummary
          expandIcon={<ArrowDropDownCircleOutlinedIcon />}
          sx={{
            padding: '0%',
            border: 'none',
            '.MuiAccordionSummary-content': {
              display: 'flex',
              alignItems: 'center',
            },
            '.MuiPaper-root.MuiAccordion-root::before': {
              display: 'none',
              height: '0px !important',
              backgroundColor: 'red',
              content: 'none',
            },
          }}
          aria-controls="panel1-content"
          id="panel1-header">
          <Typography
            sx={{fontWeight: '700', color: '#999999', fontSize: '20px'}}>
            Basic
          </Typography>
          <Divider
            orientation="horizontal"
            style={{
              borderTop: 'none',
              borderRight: '1px solid #d7d7d7',
              margin: '0px',
              marginInline: '8px',
              width: '80%',
            }}
          />
        </AccordionSummary>
        <AccordionDetails sx={{padding: 0}}>
          <div
            style={{
              display: 'flex',
              padding: '1%',
            }}>
            <DraggableButton
              type="heading"
              setIsNewComponentDragging={setIsNewComponentDragging}>
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: '35px',
                  fontWeight: '200',
                }}>
                title
              </span>
              <p style={{color: '#555555'}}>Heading</p>
            </DraggableButton>
            <DraggableButton
              type="divider"
              setIsNewComponentDragging={setIsNewComponentDragging}>
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: '35px',
                  fontWeight: '200',
                }}>
                horizontal_rule
              </span>
              <p style={{color: '#555555'}}>Divider</p>
            </DraggableButton>
          </div>
          <div
            style={{
              display: 'flex',
              padding: '1%',
            }}>
            <DraggableButton
              type="text"
              setIsNewComponentDragging={setIsNewComponentDragging}>
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: '35px',
                  fontWeight: '200',
                  border: '1px solid #999999',
                  padding: '2%',
                  paddingLeft: '5%',
                  paddingRight: '5%',
                  marginBottom: '5%',
                  borderRadius: '5px',
                }}>
                abc
              </span>
              <p style={{color: '#555555'}}>Text</p>
            </DraggableButton>
            <DraggableButton
              type="paragraph"
              setIsNewComponentDragging={setIsNewComponentDragging}>
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: '35px',
                  fontWeight: '200',
                }}>
                view_headline
              </span>
              <p style={{color: '#555555'}}>Paragraph</p>
            </DraggableButton>
          </div>
        </AccordionDetails>
      </Accordion>

      <Accordion
        onChange={handleExpandedElementsChange('inputs')}
        expanded={expandedElements.includes('inputs')}
        sx={{border: 'none', boxShadow: 'none', padding: 0, width: '97%'}}>
        <AccordionSummary
          sx={{
            padding: '0%',
            border: 'none',
            '.MuiAccordionSummary-content': {
              display: 'flex',
              alignItems: 'center',
            },
          }}
          expandIcon={<ArrowDropDownCircleOutlinedIcon />}
          aria-controls="panel1-content"
          id="panel1-header">
          <Typography
            sx={{fontWeight: '700', color: '#999999', fontSize: '20px'}}>
            Inputs
          </Typography>
          <Divider
            orientation="horizontal"
            style={{
              borderTop: 'none',
              borderRight: '1px solid #d7d7d7',
              margin: '0px',
              marginInline: '8px',
              width: '76%',
            }}
          />
        </AccordionSummary>
        <AccordionDetails sx={{padding: 0}}>
          <div
            style={{
              display: 'flex',
              // justifyContent: 'center',
              padding: '1%',
            }}>
            <DraggableButton
              type="fullname"
              setIsNewComponentDragging={setIsNewComponentDragging}>
              <span
                style={{fontSize: '35px', fontWeight: '200'}}
                className="material-symbols-outlined">
                badge
              </span>
              <p style={{color: '#555555'}}> Full Name</p>
            </DraggableButton>
            <DraggableButton
              type="textField"
              setIsNewComponentDragging={setIsNewComponentDragging}>
              <span
                style={{fontSize: '35px', fontWeight: '200'}}
                className="material-symbols-outlined">
                crop_16_9
              </span>
              <p style={{color: '#555555'}}>Text Field</p>
            </DraggableButton>
          </div>
          <div
            style={{
              display: 'flex',
              // justifyContent: 'center',
              padding: '1%',
            }}>
            <DraggableButton
              type="datetime"
              setIsNewComponentDragging={setIsNewComponentDragging}>
              <span
                style={{fontSize: '35px', fontWeight: '200'}}
                className="material-symbols-outlined">
                calendar_month
              </span>
              <p style={{color: '#555555'}}>Date</p>
            </DraggableButton>

            <DraggableButton
              type="textarea"
              setIsNewComponentDragging={setIsNewComponentDragging}>
              <span
                style={{fontSize: '35px', fontWeight: '200'}}
                className="material-symbols-outlined">
                notes
              </span>
              <p style={{color: '#555555'}}>Text Area</p>
            </DraggableButton>
          </div>
          <div
            style={{
              display: 'flex',
              padding: '1%',
              // justifyContent: 'center',
            }}>
            <DraggableButton
              type="number"
              setIsNewComponentDragging={setIsNewComponentDragging}>
              <span
                style={{fontSize: '35px', fontWeight: '200'}}
                className="material-symbols-outlined">
                pin
              </span>
              <p style={{color: '#555555'}}>Number</p>
            </DraggableButton>
            <DraggableButton
              type="phoneNumber"
              setIsNewComponentDragging={setIsNewComponentDragging}>
              <span
                style={{fontSize: '35px', fontWeight: '200'}}
                className="material-symbols-outlined">
                call
              </span>
              <p style={{color: '#555555'}}>Phone Number</p>
            </DraggableButton>
          </div>
          <div
            style={{
              display: 'flex',
              // justifyContent: 'center',
              // marginTop: '2%',
              padding: '1%',
            }}>
            <DraggableButton
              type="email"
              setIsNewComponentDragging={setIsNewComponentDragging}>
              <span
                className="material-symbols-outlined"
                style={{fontSize: '35px', fontWeight: '200'}}>
                mail
              </span>
              <p style={{color: '#555555'}}>Email</p>
            </DraggableButton>
            <DraggableButton
              type="address"
              setIsNewComponentDragging={setIsNewComponentDragging}>
              <span
                className="material-symbols-outlined"
                style={{fontSize: '35px', fontWeight: '200'}}>
                dns
              </span>
              <p style={{color: '#555555'}}>Address</p>
            </DraggableButton>
          </div>
        </AccordionDetails>
      </Accordion>

      <Accordion
        onChange={handleExpandedElementsChange('selection')}
        expanded={expandedElements.includes('selection')}
        sx={{border: 'none', boxShadow: 'none', padding: 0, width: '97%'}}>
        <AccordionSummary
          sx={{
            padding: '0%',
            border: 'none',
            '.MuiAccordionSummary-content': {
              display: 'flex',
              alignItems: 'center',
            },
          }}
          expandIcon={<ArrowDropDownCircleOutlinedIcon />}
          aria-controls="panel1-content"
          id="panel1-header">
          <Typography
            sx={{fontWeight: '700', color: '#999999', fontSize: '20px'}}>
            Selection
          </Typography>
          <Divider
            orientation="horizontal"
            style={{
              borderTop: 'none',
              borderRight: '1px solid #d7d7d7',
              margin: '0px',
              marginInline: '8px',
              width: '66%',
            }}
          />
        </AccordionSummary>
        <AccordionDetails sx={{padding: 0}}>
          <div
            style={{
              display: 'flex',
              // justifyContent: 'center',
              padding: '1%',
            }}>
            <DraggableButton
              type="select"
              setIsNewComponentDragging={setIsNewComponentDragging}>
              <span
                style={{fontSize: '35px', fontWeight: '200'}}
                className="material-symbols-outlined">
                arrow_drop_down_circle
              </span>
              <p style={{color: '#555555'}}>Select</p>
            </DraggableButton>
            <DraggableButton
              type="radio"
              setIsNewComponentDragging={setIsNewComponentDragging}>
              <span
                className="material-symbols-outlined"
                style={{fontSize: '35px', fontWeight: '200'}}>
                radio_button_checked
              </span>
              <p style={{color: '#555555'}}>Radio</p>
            </DraggableButton>
          </div>
          <div
            style={{
              display: 'flex',
              padding: '1%',
              // justifyContent: 'center',
            }}>
            <DraggableButton
              type="checkbox"
              setIsNewComponentDragging={setIsNewComponentDragging}>
              <span
                style={{fontSize: '35px', fontWeight: '200'}}
                className="material-symbols-outlined">
                select_check_box
              </span>
              <p style={{color: '#555555'}}>Checkbox</p>
            </DraggableButton>
            <DraggableButton
              type="checkboxGroup"
              setIsNewComponentDragging={setIsNewComponentDragging}>
              <span
                style={{fontSize: '35px', fontWeight: '200'}}
                className="material-symbols-outlined">
                library_add_check
              </span>
              <p style={{color: '#555555'}}>Checkbox Group</p>
            </DraggableButton>
          </div>
          <div
            style={{
              display: 'flex',
              padding: '1%',
              // paddingLeft: '6%',
              // justifyContent: "center",
            }}>
            <DraggableButton
              type="multiSelect"
              setIsNewComponentDragging={setIsNewComponentDragging}>
              <span
                style={{fontSize: '35px', fontWeight: '200'}}
                className="material-symbols-outlined">
                checklist_rtl
              </span>
              <p style={{color: '#555555'}}>Multi Select</p>
            </DraggableButton>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

function DraggableButton({children, type, setIsNewComponentDragging}) {
  const handleDragStart = event => {
    setIsNewComponentDragging(true);
    event.dataTransfer.setData('text/plain', type);
  };

  return (
    <button
      type="button"
      style={{
        // height: '55px',
        textTransform: 'capitalize',
        fontWeight: '500',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        color: 'black',
        borderRadius: '5px',
        width: '150px',
        alignItems: 'center',
        // display: 'flex',
        marginTop: '10px',
        // marginRight: '15px',
      }}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={() => setIsNewComponentDragging(false)}>
      {children}
    </button>
  );
}
