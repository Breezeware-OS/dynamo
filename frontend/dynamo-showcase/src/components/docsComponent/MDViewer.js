import React from 'react';

const MDViewer = ({data}) => {
  //   const handleClick = event => {
  //     const target = event.target;
  //     if (target.tagName === 'BUTTON') {
  //       const content = target.innerText;
  //       console.log(content);
  //     }
  //   };
  const handleCopy = content => {
    navigator.clipboard?.writeText(content).catch(error => {
      console.error('Failed to copy content:', error);
    });
  };

  const handleClick = event => {
    const target = event.target;
    if (target.tagName === 'BUTTON') {
      const codeBlock = target.closest('pre').querySelector('code');
      if (codeBlock) {
        const content = codeBlock.innerText;
        handleCopy(content);
      }
    }
  };
  return (
    <div
      className="render"
      onClick={handleClick}
      dangerouslySetInnerHTML={{
        __html: `<h1>${data?.[0]?.title ? data?.[0]?.title : 'Untitled'}</h1> ${
          data?.[0]?.htmlContent ? data?.[0]?.htmlContent : '<div></div>'
        }`,
      }}
    />
  );
};

export default MDViewer;
