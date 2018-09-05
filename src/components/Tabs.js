import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

const CustomTabs = props => (
  <Tabs>
    <TabList>
      {this.props.children.map((el, i) => (
        <Tab key={`tab-${i.toString()}`}>el.props.title</Tab>
      ))}
    </TabList>
    {this.props.children.map((el, i) => (
      <TabPanel>{el.props.title}</TabPanel>
    ))}
  </Tabs>
);

export default CustomTabs;
