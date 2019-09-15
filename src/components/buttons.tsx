import * as React from 'react';
import styled from 'styled-components';

import {MainStoreContext} from '../store/context';
import OpenFolderIcon from '../icons/open-folder'

const StyledScanButton = styled.div`
  min-height: 24px;
  border: solid 1px rgba(0,0,0, 0.8);
  border-radius: 4px;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px;
  background: white;
  cursor:pointer;
  
  :hover {
    background: rgba(0,0,0, 0.8);
    color: white;
    svg {
      fill: white;
    }
  }
  
`;

const StyledIconWrapper = styled.span`
    height: 24px;
    margin-right: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
      height: 18px;
    }
`;


export function ScanFolderButton():JSX.Element {
    const mainStore = React.useContext(MainStoreContext);
    return (
        <StyledScanButton onClick={() => mainStore.startDirectoryScan()}>
            <StyledIconWrapper><OpenFolderIcon /></StyledIconWrapper>
            <span>Scan folder</span>
        </StyledScanButton>
    )
}