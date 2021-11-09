import React, { useState } from 'react';
import { Tab, Tabs } from '@mui/material';
import { Box } from '@mui/system';

import MultilineInput from '../../inputs/MultilineInput';

const Script = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleChangeTab = (event, value) => {
		setActiveTab(value);
	}

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '90%' }}>
        <Tabs value={activeTab} onChange={handleChangeTab} aria-label="basic tabs example" variant="fullWidth">
          <Tab label="Type your script" id="simple-tab-1" />
          <Tab label="Upload your voice" id="simple-tab-2" />
        </Tabs>
      </Box>
      <div
        role="tabpanel"
        hidden={activeTab !== 0}
        id={`vertical-tabpanel-${0}`}
        aria-labelledby={`vertical-tab-${0}`}
        style={{ width: '90%', backgroundColor: '#e8e9e9' }}
      >
        {activeTab === 0 && (
          <Box sx={{ p: 3, width: '100%' }}>
            <MultilineInput
              minRows={10}
              maxRows={10}
              // value={value}
              // onChange={handleChange}
            />
          </Box>
        )}
      </div>
      <div
        role="tabpanel"
        hidden={activeTab !== 1}
        id={`vertical-tabpanel-${1}`}
        aria-labelledby={`vertical-tab-${1}`}
      >
        {activeTab === 1 && (
          <Box sx={{ p: 3, width: '100%' }}>
          </Box>
        )}
      </div>
    </Box>
  );
}
 
export default Script;