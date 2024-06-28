import {Chip, Menu, MenuItem, Table, Text} from 'glide-design-system';
import {useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import React, {useState} from 'react';
import {MoreHoriz} from '@mui/icons-material';
import {IconButton} from '@mui/material';
import {
  reviewerWorkflowFormSliceActions,
  resumeWorkflowApplicantion,
} from '../../../screens/workflow/reviewer/ReviewweWorkflowSlice';

const sampleData = [
  {
    id: '1',
    applicationId: '12345',
    user: 'Surya Kumar',
    status: 'application_in-progress',
    createdDate: '2019-08-18T14:38:40.108Z',
  },
  {
    id: '2',
    applicationId: '12345',
    status: 'upload_document',
    createdDate: '2019-08-18T14:38:40.108Z',
  },
  {
    id: '3',
    applicationId: '12345',
    status: 'sign_document',
    createdDate: '2019-08-18T14:38:40.108Z',
  },
  {
    id: '4',
    applicationId: '12345',
    status: 'document_uploaded',
    createdDate: '2019-08-18T14:38:40.108Z',
  },
  {
    id: '5',
    applicationId: '12345',
    status: 'application_submitted',
    createdDate: '2019-08-18T14:38:40.108Z',
  },
  {
    id: '6',
    applicationId: '12345',
    status: 'approved',
    createdDate: '2019-08-18T14:38:40.108Z',
  },
  {
    id: '7',
    applicationId: '12345',
    status: 'declined',
    createdDate: '2019-08-18T14:38:40.108Z',
  },
];

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

const ReviewerWorkFlowTable = ({
  status,
  sortHandler,
  sortItem,
  sortOrder,
  data,
  loading,
  user,
  message,
}) => {
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
                  // rowItem?.status?.toLowerCase() === 'application_review' ||
                  // rowItem?.status?.toLowerCase() === 'upload_document' ||
                  // rowItem?.status?.toLowerCase() === 'sign_document'
                  //   ? 'black'
                  '#4c92c6',
                fontSize: '16px',
              }}>
              {`#${rowItem?.id}`}
            </Text>
          </div>
        );
      },
    },
    {
      label: 'user',
      sort: false,
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
                  rowItem?.status?.toLowerCase() === 'application_review'
                    ? '#81d3f8'
                    : rowItem?.status?.toLowerCase() === 'application_reviewed'
                    ? '#b1dfd1'
                    : rowItem?.status?.toLowerCase() === 'upload_document'
                    ? '#facd91'
                    : rowItem?.status?.toLowerCase() === 'sign_document'
                    ? '#c1c0ff'
                    : rowItem?.status?.toLowerCase() === 'document_review'
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
              rowItem.status.toLowerCase() === 'declined' ||
              rowItem.status.toLowerCase() === 'approved' ||
              rowItem.status.toLowerCase() === 'application_reviewed'
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
        id="reviewer-workflow-table"
        style={{borderLeft: 'none', borderRight: 'none', borderBottom: 'none'}}
        columns={columns}
        data={data?.content || []}
        sortHandler={sortHandler}
        sortItem={sortItem}
        sortOrder={sortOrder}
        loading={loading}
        progressCircleStyle={{color: '#0a5b99'}}
        message={message}
      />
      <Menu
        style={{boxShadow: 'none', cursor: 'pointer'}}
        anchorEl={applicantActionsAnchorEl}
        open={Boolean(applicantActionsAnchorEl)}
        position="bottom"
        onClose={() => setApplicantActionsAnchorEl(null)}>
        <MenuItem
          onClick={() => {
            // dispatch(
            //   reviewerWorkflowFormSliceActions.handleIsStartApplication(false),
            // );
            // dispatch(reviewerWorkflowFormSliceActions.setStatus('loading'));
            // dispatch(
            //   reviewerWorkflowFormSliceActions.setReviewerDetail(
            //     currentWorkflow,
            //   ),
            // );
            // dispatch(
            //   resumeWorkflowApplicantion(currentWorkflow?.applicationId),
            // );
            if (
              currentWorkflow.status === 'DOCUMENT_REVIEW' ||
              currentWorkflow.status === 'DOCUMENT REVIEW'
            ) {
              navigate(
                `/review-document-workflow/${currentWorkflow?.applicationId}`,
              );
            } else {
              navigate(`/review-workflow/${currentWorkflow?.applicationId}`);
            }
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
};

export default ReviewerWorkFlowTable;
