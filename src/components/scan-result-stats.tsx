import styled from 'styled-components';
import * as React from 'react';

interface ScanResultsStatsProps {
    readonly sizeInBytes: number;
    readonly numberOfFiles: number;
    readonly numberOfFolders: number;
}

const StyledScanResultsStats = styled.div`
  border-radius: 100%;
  border: solid 10px green;
  height: 200px;
  width: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  flex-shrink: 1;
`;

const StyledPrimaryStat = styled.h1`
   color: black;
   font-weight: 700;
`;

const StyledSecondaryStat = styled.div`
      color: rgba(0, 0, 0, 0.4);
`;

const UNITS = [
    'B',
    'kB',
    'MB',
    'GB',
    'TB',
    'PB',
    'EB',
    'ZB',
    'YB'
];

function formatSize(size: number): string {
    if (size < 1) {
        const numberString = size.toString(10);
        return numberString + ' ' + UNITS[0];
    }
    const exponent = Math.min(Math.floor(Math.log10(size) / 3), UNITS.length - 1);
    size = Number((size / Math.pow(1000, exponent)).toPrecision(3));
    const numberString = size.toString(10);
    const unit = UNITS[exponent];
    return numberString + ' ' + unit;
}

export const ScanResultsStats = function ScanResultsStats(props: ScanResultsStatsProps) {
    return(
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <StyledScanResultsStats>
                <StyledPrimaryStat>{formatSize(props.sizeInBytes)}</StyledPrimaryStat>
                <StyledSecondaryStat>{props.numberOfFiles} files </StyledSecondaryStat>
                <StyledSecondaryStat>{props.numberOfFolders} folders</StyledSecondaryStat>
            </StyledScanResultsStats>
        </div>
    )
};