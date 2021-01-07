import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import React from 'react';

import ClearIcon from '@material-ui/icons/Clear';
export default () => (
  <Tabs>
    <TabList>
      <Tab>Add 1 <ClearIcon></ClearIcon> </Tab>
      <Tab>Edit 2  <ClearIcon></ClearIcon></Tab>
    </TabList>

    <TabPanel>
      <h2>Any content 1</h2>
    </TabPanel>
    <TabPanel>
      <h2>Any content 2</h2>
    </TabPanel>
  </Tabs>
);