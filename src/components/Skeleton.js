import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';

export default function Variants() {
  return (
    <div>
      <Skeleton variant="text" />
      {/* <Skeleton variant="circle" width={40} height={40} /> */}
      <Skeleton variant="rect" width={'100%'} height={400} />
    </div>
  );
}