import React, {useState} from 'react';
import {
  Avatar,
  Chip,
  Menu,
  MenuItem,
  Pagination,
  Table,
  Text,
} from 'glide-design-system';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {IconButton} from '@mui/material';
import {MoreHoriz} from '@mui/icons-material';
import {
  applicantWorkflowFormSliceActions,
  resumeWorkflowApplicantion,
} from '../../../screens/workflow/ApplicantWorkflowFormSlice';



const transformText = text => {
  const splitArray = text.split('_');
  const updatedText = [];
  splitArray.map(element => {
    const firstLetter = element.charAt(0).toUpperCase();
    const rest = element.slice(1).toLowerCase();

    updatedText.push(firstLetter + rest);
  });

  return updatedText.join(' ');
};

export default function ApplicantWorkflowTable({
  status,
  sortHandler,
  sortItem,
  sortOrder,
  data,
  loading,
  user,
}) {
  const [currentWorkflow, setCurrentWorkflow] = useState(null);
  const [applicantActionsAnchorEl, setApplicantActionsAnchorEl] = useState(
    null,
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const columns = [
    {
      label: 'applicationId',
      fieldName: 'id',
      sort: true,
      style: {
        textAlign: 'left',
      },

      customBodyRenderer: rowItem => {
        return (
          <div
            role="button" // make div hehave as a button
            tabIndex="0" // make div hehave as a button
            id={`applicationId-${rowItem?.applicationId}`}
            //   onClick={() => navigate(`/patient/${rowItem?.id}`)}
            style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
            }}>
            <Text
              style={{
                marginLeft: '10px',
                color:
                  rowItem?.status?.toLowerCase() ===
                    'application_in-progress' ||
                  rowItem?.status?.toLowerCase() === 'upload_document' ||
                  rowItem?.status?.toLowerCase() === 'sign_document'
                    ? 'black'
                    : '#4c92c6',
                fontSize: '16px',
              }}>
              {`#${rowItem?.id}`}
            </Text>
          </div>
        );
      },
    },
    {
      label: 'status',
      sort: true,
      customBodyRenderer: rowItem => {
        if (
          rowItem.severity !== '' &&
          rowItem.severity !== null &&
          rowItem.severity !== '-'
        ) {
          return (
            <Chip
              style={{
                padding: '5px',
                fontSize: '12px',
                fontWeight: '400',
                // height: '27px',
                color: '#333333',
                textTransform: 'none',
                backgroundColor:
                  rowItem?.status?.toLowerCase() === 'application_in-progress'
                    ? '#81d3f8'
                    : rowItem?.status?.toLowerCase() === 'upload_document'
                    ? '#facd91'
                    : rowItem?.status?.toLowerCase() === 'sign_document'
                    ? '#c1c0ff'
                    : rowItem?.status?.toLowerCase() === 'document_uploaded'
                    ? '#facd91'
                    : rowItem?.status?.toLowerCase() === 'application_submitted'
                    ? '#4c92c6'
                    : rowItem?.status?.toLowerCase() === 'approved'
                    ? '#b1dfd1'
                    : rowItem?.status?.toLowerCase() === 'rejected'
                    ? '#eeb1b8'
                    : '#d7d7d7',
              }}>
              {transformText(rowItem?.status)}
            </Chip>
          );
        }
        return (
          <Text
          //  style={{height: '24px'}}
          >
            -
          </Text>
        );
      },
    },
    {
      label: 'createdOn',
      sort: true,
      style: {
        textAlign: 'left',
      },
      type: 'date',
    },
    {
      label: 'Actions',
      customBodyRenderer: rowItem => {
        return (
          <IconButton
            id="action-btn"
            sx={{padding: '0'}}
            disabled={
              rowItem.status.toLowerCase() !== 'in_progress' &&
              rowItem.status.toLowerCase() !== 'application_reviewed'
            }
            onClick={e => {
              setApplicantActionsAnchorEl(e.currentTarget);
              setCurrentWorkflow(rowItem);
            }}>
            <MoreHoriz sx={{fontSize: '39px'}} />
          </IconButton>
        );
      },
    },
  ];

  return (
    <div>
      <Table
        id="applicant-workflow-table"
        style={{borderLeft: 'none', borderRight: 'none', borderBottom: 'none'}}
        columns={columns}
        data={data?.content}
        sortHandler={sortHandler}
        sortItem={sortItem}
        sortOrder={sortOrder}
        loading={loading}
        progressCircleStyle={{color: '#0a5b99'}}
        message={data?.content?.length <= 0 && 'No matching workflow found'}
      />
      <Menu
        style={{boxShadow: 'none', cursor: 'pointer'}}
        anchorEl={applicantActionsAnchorEl}
        open={Boolean(applicantActionsAnchorEl)}
        position="bottom"
        onClose={() => setApplicantActionsAnchorEl(null)}>
        <MenuItem
          onClick={() => {
            dispatch(
              applicantWorkflowFormSliceActions.handleIsStartApplication(false),
            );
            dispatch(applicantWorkflowFormSliceActions.setStatus('loading'));
            dispatch(
              applicantWorkflowFormSliceActions.setApplicantDetail(
                currentWorkflow,
              ),
            );
            dispatch(
              resumeWorkflowApplicantion(currentWorkflow?.applicationId),
            );
            navigate(
              `/start-workflow/${currentWorkflow?.applicationId}/${currentWorkflow?.status}`,
            );
            setApplicantActionsAnchorEl(null);
          }}>
          <span style={{color: '#0a5b99'}} class="material-symbols-outlined">
            play_arrow
          </span>
          <Text>Resume</Text>
        </MenuItem>
      </Menu>
    </div>
  );
}
