import {
  Box,
  Divider,
  IconButton,
  Typography,
  Menu,
  MenuItem,
} from '@mui/material';
import {makeStyles} from '@material-ui/core';
import {Auth} from 'aws-amplify';
import {useNavigate} from 'react-router-dom';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import {NavbarLayout, Avatar, Button, Drawer} from 'glide-design-system';
import React, {useEffect, useState} from 'react';
import forms from '../../assets/logo/category_FILL0_wght400_GRAD0_opsz20.png';
import logo from '../../assets/logo/dynamo.png';
import menu from '../../assets/icon/apps.svg';

const AppBar = ({signOut, user}) => {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const classes = useStyles();
  const navigate = useNavigate();
  const [navigationMenu, setNavMenu] = useState([]);
  const [chosenPage, setChosenPage] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [showWorkflow, setShowWorkflow] = useState(false);
  const [appMenu, setAppMenu] = useState(null);
  const [allowedApps, setAllowedApps] = useState([]);
  const [workflowOptionAnchorEl, setWorkflowOptionAnchorEl] = useState(null);
  const openWorkflowOptions = Boolean(workflowOptionAnchorEl);

  const {
    'custom:firstName': firstName,
    'custom:lastName': lastName,
    phone_number: phnNumber,
    email,
  } = user?.attributes;

  const handleOpenApplicationMenu = event => {
    setAppMenu(event.currentTarget);
  };

  const handleOpenUserMenu = event => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenWorkflowActions = event => {
    setWorkflowOptionAnchorEl(event.currentTarget);
  };

  const handleCloseWorkflowActions = () => {
    setWorkflowOptionAnchorEl(null);
  };

  const handleActivePage = page => {
    setChosenPage(page);
    if (page === 'Forms') {
      setChosenPage('Forms');
      navigate('/forms');
    }
    if (page === 'Users') {
      setChosenPage('Users');
      navigate('/users');
    }
    if (page === 'Workflow') {
      setChosenPage('Workflow');
      navigate('/workflow');
    }

    setOpenDrawer(false);
  };

  const handleCloseApplicationMenu = () => {
    setAppMenu(null);
  };

  const chooseImage = data => {
    if (data === 'Forms') {
      return (
        // <img className={forms} alt="" style={{color: 'white !important'}} />

        <span
          className="material-symbols-outlined"
          style={{fontSize: '16px !important'}}>
          category
        </span>
      );
    }
    if (data === 'Users') {
      return (
        <span
          className="material-symbols-outlined"
          style={{fontSize: '16px !important'}}>
          groups
        </span>
      );
    }
    if (data === 'Workflow') {
      return (
        <span style={{fontSize: '20px'}} className="material-symbols-outlined">
          rebase
        </span>
      );
    }
  };

  useEffect(() => {
    // if (window.location.pathname === '/forms') {
    //   setChosenPage('Forms');
    // }
    if (window.location.pathname.includes('form')) {
      setChosenPage('Forms');
    } else if (window.location.pathname.includes('users')) {
      setChosenPage('Users');
    } else if (window.location.pathname.includes('workflow')) {
      setChosenPage('Workflow');
    } else if (window.location.pathname.includes('reviewer')) {
      setChosenPage('Workflow');
    } else if (window.location.pathname.includes('docs')) {
      setChosenPage('Docs');
    } else if (window.location.pathname.includes('AI')) {
      setChosenPage('AI');
    } else {
      setChosenPage([]);
    }
    // if (window.location.pathname.includes('home')) {
    setNavMenu(['Forms', 'Users', 'Docs', 'AI']);
    // }
  }, [window.location.pathname]);

  return (
    <>
      <NavbarLayout
        style={{
          position: 'fixed',
          zIndex: '1',
          backgroundColor: 'white',
          boxShadow: '#a5a5a5 0px 0px 5px 0px',
          height: '50px',
        }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            paddingLeft: '24px',
          }}>
          <img
            src={logo}
            alt="Logo"
            style={{
              height: '35px',
            }}
          />
          {/* {navigationMenu?.map(
            (page, i) =>
              i !== navigationMenu?.length - 1 && (
                <div
                  key={page}
                  style={{marginLeft: i !== 0 ? '0px' : '10px'}}
                  onClick={e =>
                    page === 'Workflow' && handleOpenWorkflowActions(e)
                  }
                  className={
                    page === chosenPage
                      ? `${classes.active} ${classes.pageHeader}`
                      : classes.pageHeader
                  }>
                  <Button
                    key={page}
                    onClick={() =>
                      page !== 'Workflow' && handleActivePage(page)
                    }
                    size="small"
                    id={page}
                    style={{backgroundColor: 'inherit'}}
                    icon={
                      page === 'Workflow' ? (
                        <span
                          style={{fontSize: '16px'}}
                          className="material-symbols-outlined">
                          rebase
                        </span>
                      ) : page === 'Forms' ? (
                        <span
                          style={{fontSize: '16px'}}
                          className="material-symbols-outlined">
                          category
                        </span>
                      ) : page === 'Users' ? (
                        <span
                          style={{fontSize: '16px'}}
                          className="material-symbols-outlined">
                          group
                        </span>
                      ) : (
                        <span
                          style={{fontSize: '20px'}}
                          className="material-symbols-outlined"
                        />
                      )
                    }
                    className={
                      page === chosenPage
                        ? `${classes.buttonActive}`
                        : `${classes.button}`
                    }>
                    {page}
                    {page === 'Workflow' && (
                      <IconButton
                        id="workflow-options"
                        sx={{color: 'white', paddingLeft: 0}}>
                        <KeyboardArrowDownIcon />
                      </IconButton>
                    )}
                  </Button>
                  <Menu
                    // position={'bottom'}
                    style={{
                      top: '47px',
                      boxShadow: 'none',
                      border: '1px solid #d7d7d7',
                    }}
                    anchorEl={workflowOptionAnchorEl}
                    open={Boolean(workflowOptionAnchorEl)}
                    onClose={handleCloseWorkflowActions}>
                    <MenuItem
                      id="applicant-workflow-btn"
                      style={{
                        color: 'black',
                        textAlign: 'center',
                        gap: '5px',
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        setChosenPage('Workflow');
                        navigate('/applicant-workflow');
                        handleCloseWorkflowActions();
                      }}>
                      <span
                        style={{fontSize: '16px', color: '#0a5b99'}}
                        className="material-symbols-outlined">
                        badge
                      </span>{' '}
                      Applicant
                    </MenuItem>
                    <Divider />
                    <MenuItem
                      id="reviewer-workflow-btn"
                      style={{
                        color: 'black',
                        textAlign: 'center',
                        gap: '5px',
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        navigate('/reviewer-workflow');
                        setChosenPage('Workflow');
                        handleCloseWorkflowActions();
                      }}>
                      <span
                        style={{fontSize: '16px', color: '#0a5b99'}}
                        className="material-symbols-outlined">
                        manage_accounts
                      </span>{' '}
                      Reviewer
                    </MenuItem>
                  </Menu>
                </div>
              ),
          )} */}
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            paddingRight: '24px',
          }}
          className={classes.navDetails}>
          <Box
            sx={{
              flexGrow: 1,
              textAlign: 'right',
              marginLeft: 'auto',
              alignItems: 'center',
              display: 'flex',
            }}>
            <IconButton id="spring-board" onClick={handleOpenApplicationMenu}>
              <img src={menu} alt="" style={{height: '30px'}} />
            </IconButton>
            <Menu
              sx={{padding: '0px'}}
              anchorEl={appMenu}
              open={Boolean(appMenu)}
              onClose={handleCloseApplicationMenu}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              MenuListProps={{sx: {padding: '0px'}}}>
              {navigationMenu?.map((appName, i) => {
                return (
                  <>
                    <MenuItem
                      style={{
                        backgroundColor:
                          chosenPage === appName ? '#1b3764' : '',
                        color: chosenPage === appName ? 'white' : '',
                        borderTopLeftRadius: chosenPage === 'Workflow' && '5px',
                        borderTopRightRadius:
                          chosenPage === 'Workflow' && '5px',
                        borderBottomLeftRadius: chosenPage === 'AI' && '5px',
                        borderBottomRightRadius: chosenPage === 'AI' && '5px',
                        padding: '8px',
                        width: '162px',
                        paddingLeft: '24px',
                      }}
                      className={classes.menuItem}
                      key={appName}
                      name="applications"
                      id={`app-${i}`}
                      onClick={() => {
                        setChosenPage(appName);
                        handleCloseApplicationMenu();
                        appName === 'Forms'
                          ? navigate('/forms')
                          : appName === 'Users'
                          ? navigate('/users')
                          : appName === 'Workflow'
                          ? navigate('/applicant-workflow')
                          : appName === 'Docs'
                          ? navigate('/docs/home')
                          : appName === 'AI'
                          ? navigate('/AI/home')
                          : navigate('/forms');
                      }}>
                      {appName === 'Workflow' ? (
                        <span
                          style={{fontSize: '16px'}}
                          className="material-symbols-outlined">
                          rebase
                        </span>
                      ) : appName === 'Forms' ? (
                        <span
                          style={{fontSize: '16px'}}
                          className="material-symbols-outlined">
                          category
                        </span>
                      ) : appName === 'Users' ? (
                        <span
                          style={{fontSize: '16px'}}
                          className="material-symbols-outlined">
                          group
                        </span>
                      ) : appName === 'AI' ? (
                        <span
                          style={{fontSize: '16px'}}
                          className="material-symbols-outlined">
                          robot_2
                        </span>
                      ) : (
                        <span
                          style={{fontSize: '16px'}}
                          className="material-symbols-outlined">
                          workspaces
                        </span>
                      )}
                      <Typography
                        style={{
                          fontFamily: 'Roboto, sans-serif',
                          fontSize: '16px',
                          display: 'flex',
                          paddingLeft: '5px',
                        }}>
                        {appName}
                      </Typography>{' '}
                    </MenuItem>
                    {i !== navigationMenu?.length - 1 && (
                      <Divider
                        sx={{
                          border: '1px solid #f2f2f2',
                          margin: '0px !important',
                        }}
                      />
                    )}
                  </>
                );
              })}
            </Menu>
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              textAlign: 'right',
              marginLeft: 'auto',
              alignItems: 'center',
            }}>
            <Menu
              sx={{mt: '45px'}}
              anchorEl={anchorElUser}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              position={'bottomLeft'}
              style={{top: '47px'}}>
              <MenuItem
                className={classes.menuItem}
                onClick={() => {
                  handleCloseUserMenu();
                }}>
                <Avatar
                  label={email?.charAt(0)}
                  style={{
                    marginRight: '9px',
                    width: '26px',
                    height: '26px',
                    backgroundColor: '#1b3764 ',
                    color: 'white',
                  }}
                />
                {email ? email : '-'}
              </MenuItem>
              <Divider sx={{border: '1px solid #f2f2f2'}} />

              <MenuItem
                className={classes.menuItem}
                onClick={() => {
                  handleCloseUserMenu();
                  // signOut();
                  Auth.signOut().then(res => {
                    navigate('/');
                    window.location.reload();
                  });
                }}>
                <span
                  className={`material-symbols-outlined ${classes.logoutIcon}`}>
                  logout
                </span>
                Logout
              </MenuItem>
            </Menu>
          </Box>
          <Box
            sx={{
              flexGrow: 0,
              textAlign: 'right',
              marginLeft: 'auto',
              display: 'flex',
              justifyContent: 'center',
            }}>
            <Avatar
              label={user?.attributes?.email.charAt(0).toUpperCase()}
              onClick={handleOpenUserMenu}
            />
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            paddingRight: '24px',
          }}
          className={classes.navbarMenuMobile}>
          <IconButton
            onClick={() => setOpenDrawer(true)}
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer">
            <MenuIcon
              id="menu-icon-mbl"
              className={classes.menuIcon}
              fontSize="large"
            />
          </IconButton>
        </Box>
      </NavbarLayout>
      <Drawer
        position="right"
        style={{backgroundColor: '#0a5b99'}}
        // PaperProps={{
        //   style: {
        //     backgroundColor: '#0a5b99',
        //   },
        // }}
        onClose={() => setOpenDrawer(false)}
        open={openDrawer}>
        <div style={{backgroundColor: '#0a5b99'}}>
          <IconButton
            onClick={() => setOpenDrawer(false)}
            size="large"
            edge="start"
            color="inherit"
            style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'flex-end',
              padding: '0px',
              marginBottom: '14px',
            }}
            aria-label="open drawer">
            <CloseIcon
              className={classes.cancelIcon}
              fontSize="large"
              id="cancel-icon"
            />
          </IconButton>
          {navigationMenu?.map((page, i) => (
            <>
              <div
                className={
                  page === chosenPage
                    ? `${classes.activeMobile} ${classes.pageHeaderMobile}`
                    : classes.pageHeaderMobile
                }
                onClick={() => {
                  if (page === 'Workflow') {
                    setShowWorkflow(!showWorkflow);
                  } else {
                    handleActivePage(page);
                  }
                }}
                style={{
                  display: 'flex !important',
                  flexDirection: 'row !important',
                  height: '50px',
                  justifyContent: 'left !important',
                  paddingLeft: '25px',
                  gap: '10px',
                  alignItems: 'center !important',
                  width: '100% !important',
                  backgroundColor: 'red !important',
                }}>
                {chooseImage(page)}
                <div
                  key={page}
                  id={`nav-menu-${i}`}
                  // style={{height: '50px'}}
                >
                  {page}
                </div>
                {page === 'Workflow' && (
                  <span
                    style={{
                      fontSize: '45px',
                      marginRight: '10px',
                      marginLeft: 'auto',
                    }}
                    className="material-symbols-outlined">
                    expand_less
                  </span>
                )}
              </div>

              {page === 'Workflow' && showWorkflow && (
                <div>
                  <div
                    id="applicant-workflow-btn"
                    style={{
                      color: 'white',
                      textAlign: 'center',
                      gap: '5px',
                      display: 'flex',
                      alignItems: 'center',
                      paddingLeft: '55px',
                      height: '50px',
                    }}
                    onClick={() => {
                      setChosenPage('Workflow');
                      navigate('/applicant-workflow');
                      handleCloseWorkflowActions();
                    }}>
                    <span
                      style={{fontSize: '20px', color: 'white'}}
                      className="material-symbols-outlined">
                      badge
                    </span>{' '}
                    Applicant
                  </div>
                  <div
                    id="reviewer-workflow-btn"
                    style={{
                      color: 'white',
                      textAlign: 'center',
                      gap: '5px',
                      display: 'flex',
                      alignItems: 'center',
                      paddingLeft: '55px',
                      height: '50px',
                    }}
                    onClick={() => {
                      setChosenPage('Workflow');
                      handleCloseWorkflowActions();
                    }}>
                    <span
                      style={{fontSize: '20px', color: 'white'}}
                      className="material-symbols-outlined">
                      manage_accounts
                    </span>{' '}
                    Reviewer
                  </div>
                </div>
              )}
            </>
          ))}
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              height: '50px',
              gap: '10px',
              paddingLeft: '25px',
            }}>
            <Avatar
              label={user?.attributes?.email.charAt(0).toUpperCase()}
              // style={{margin: '0px 15px 0px 33px'}}
            />
            <Typography style={{color: '#ffffff', textTransform: 'capitalize'}}>
              {email ? email : '-'}
            </Typography>
          </Box>
        </div>
      </Drawer>
    </>
  );
};

export default AppBar;

const useStyles = makeStyles(theme => ({
  leftbar: {
    display: 'block',
    [theme.breakpoints.down('lg')]: {
      display: 'none !important',
    },
  },
  menu: {
    display: 'flex !important',
    marginLeft: '-25px !important',
    marginRight: '5px !important',
    marginTop: '-5px !important',
    [theme.breakpoints.up('1280')]: {
      display: 'none !important',
    },
  },
  adminTxt: {
    fontWeight: '700 !important',
    fontSize: '12px !important',
    color: 'rgb(127, 127, 127)',
  },
  usermangTxt: {
    fontWeight: '700 !important',
    fontSize: '15px !important',
    color: '#333333',
  },
  desTxt: {
    fontWeight: '400 !important',
    fontSize: '10px !important',
    color: '#AAAAAA',
  },

  profileIconAdmin: {
    flexGrow: 0,
    textAlign: 'right',
  },
  profileIconUser: {
    flexGrow: 0,
    textAlign: 'right',
    marginLeft: 'auto',
  },
  active: {
    transition: 'ease-in-out 0.2s !important',
    fontWeight: '700 !important',
    height: '100%',
    [theme.breakpoints.down('xs')]: {
      paddingLeft: '0px !important',
      paddingRight: '0px !important',
      display: 'none !important',
    },
    backgroundColor: '#084069 !important',
    '&:hover': {
      backgroundColor: '#022f4f !important',
    },
  },
  navDetails: {
    display: 'flex',
    [theme.breakpoints.down('xs')]: {
      display: 'none !important',
    },
  },
  navbarMenuMobile: {
    display: 'none !important',
    [theme.breakpoints.down('xs')]: {
      display: 'flex !important',
    },
  },
  pageHeader: {
    transition: 'ease-in-out 0.1s !important',
    height: '100%',
    fontWeight: '400 !important',
    [theme.breakpoints.down('xs')]: {
      marginLeft: '0px !important',
      display: 'none !important',
    },
    backgroundColor: 'inherit',
  },
  pageHeaderMobile: {
    transition: 'ease-in-out 0.1s !important',
    height: '100%',
    backgroundColor: 'rgb(10, 91, 153)',
    width: '100% !important',
    fontSize: '16px',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    // paddingLeft: '82px',
    color: '#ffffff',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#1b80c9 !important',
    },
  },
  activeMobile: {
    transition: 'ease-in-out 0.2s !important',
    height: '100%',
    backgroundColor: '#084069 !important',
    '&:hover': {
      backgroundColor: '#022f4f !important',
    },
    width: '100% !important',
  },

  mobilePage: {
    fontFamily: 'IBMPlexSans-SemiBold !important',
    fontSize: '14px !important',
  },

  settings: {
    [theme.breakpoints.down('sm')]: {},
  },
  button: {
    display: 'flex !important',
    whiteSpace: 'nowrap !important',
    [theme.breakpoints.down('sm')]: {
      width: '100px !important',
      display: 'flex !important',
    },
    borderRadius: '0px !important',
    height: '45px !important',
    fontFamily: 'Roboto Medium, Roboto, sans-serif',
    fontSize: '14px !important',
  },
  buttonActive: {
    display: 'flex !important',
    whiteSpace: 'nowrap !important',
    [theme.breakpoints.down('sm')]: {
      width: '100px !important',
      display: 'flex !important',
    },
    borderRadius: '0px !important',
    height: '45px !important',
    '&:hover': {
      backgroundColor: '#022f4f !important',
    },
    fontFamily: 'Roboto Medium, Roboto, sans-serif',
    fontSize: '14px !important',
    fontWeight: '700',
  },
  buttonMobile: {
    display: 'flex !important',
    whiteSpace: 'nowrap !important',
    borderRadius: '0px !important',
    height: '45px !important',
    fontFamily: 'Roboto Medium, Roboto, sans-serif',
    fontSize: '14px !important',
    width: '100% !important',
    backgroundColor: 'inherit',
  },
  buttonActiveMobile: {
    display: 'flex !important',
    whiteSpace: 'nowrap !important',
    width: '100% !important',
    borderRadius: '0px !important',
    height: '45px !important',
    '&:hover': {
      backgroundColor: '#022f4f !important',
    },
    backgroundColor: '#084069 !important',
    fontSize: '14px !important',
  },
  avatar: {
    height: '26px !important',
    width: '26px !important',
    justifyContent: 'center !important',
    alignItems: 'center !important',
    textAlign: 'center !important',
    marginRight: '9px !important',
    marginLeft: '15px !important',
    backgroundColor: '#0a5b99 !important',
    textTransform: 'capitalize !important',
    color: '#ffffff !important',
  },
  logoutIcon: {
    height: '26px !important',
    width: '26px !important',
    // justifyContent: 'center !important',
    // alignItems: 'center !important',
    // textAlign: 'center !important',
    marginRight: '9px !important',
    // marginLeft: '15px !important',
    // backgroundColor: '#0a5b99 !important',
    // textTransform: 'capitalize !important',
    color: '#1b3764 !important',
  },
  dropDown: {
    marginTop: '-1% !important',
    marginLeft: '2% !important',
    display: 'none !important',

    [theme.breakpoints.down('xs')]: {
      display: 'flex !important',
    },
  },
  menuIcon: {
    color: '#ffffff',
  },
  cancelIcon: {
    color: '#ffffff',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  menuItem: {
    cursor: 'pointer',
    width: '100%',
    justifyContent: 'left',
    padding: '16px',
  },
}));
