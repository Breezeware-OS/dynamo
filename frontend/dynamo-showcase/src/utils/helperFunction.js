/**
 * Get color of the give status
 * @param {*} type status type
 * @returns color code od the status
 */
// eslint-disable-next-line import/prefer-default-export
export const statusBackgroundColor = type => {
  return type === 'active'
    ? ' #90cb92'
    : type === 'suspended'
    ? 'rgba(249, 172, 181, 0.99)'
    : type === 'invited'
    ? ' rgba(167, 196, 230, 0.99)'
    : '#d7d7d7';
};

export const formStatusBackgroundColor = type => {
  return type === 'Published'
    ? '#90cb92'
    : type === 'Draft'
    ? ' rgba(215, 215, 215, 0.99)'
    : type === 'Invited'
    ? 'rgba(167, 196, 230, 0.99)'
    : type === 'archived'
    ? '#f0ac96'
    : '#d7d7d7';
};
