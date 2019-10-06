import * as React from "react"
import styled from "styled-components"

import {
    formatNumberOfDirs,
    formatNumberOfFiles,
    formatSize,
} from "../../utils/format"

interface ScanResultsStatsProps {
    readonly sizeInBytes: number
    readonly numberOfFiles: number
    readonly numberOfFolders: number
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
`

const StyledPrimaryStat = styled.h1`
    color: black;
    font-weight: 700;
`

const StyledSecondaryStat = styled.div`
    color: rgba(0, 0, 0, 0.4);
`

const StyledScanResultsStatsContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`

export const ScanResultsStats = function ScanResultsStats(
    props: ScanResultsStatsProps
) {
    return (
        <StyledScanResultsStatsContainer>
            <StyledScanResultsStats>
                <StyledPrimaryStat>
                    {formatSize(props.sizeInBytes)}
                </StyledPrimaryStat>
                <StyledSecondaryStat>
                    {formatNumberOfFiles(props.numberOfFiles)}
                </StyledSecondaryStat>
                <StyledSecondaryStat>
                    {formatNumberOfDirs(props.numberOfFolders)}
                </StyledSecondaryStat>
            </StyledScanResultsStats>
        </StyledScanResultsStatsContainer>
    )
}
