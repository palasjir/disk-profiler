import {createStyles, makeStyles, Theme} from "@material-ui/core"
import {blue} from "@material-ui/core/colors"

const drawerWidth = 240

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        dialog: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: theme.spacing(3, 2),
        },
        paperContent: {
            padding: theme.spacing(3, 2),
        },
        moreButton: {
            marginTop: theme.spacing(2),
        },
        buttonProgressWrapper: {
            position: "relative",
        },
        buttonProgress: {
            color: blue[500],
            position: "absolute",
            top: "50%",
            left: "50%",
            marginTop: -12,
            marginLeft: -12,
        },
        buttonLeftIcon: {
            marginRight: theme.spacing(1),
        },
        root: {
            display: "flex",
        },
        appBar: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
        },
        toolbar: theme.mixins.toolbar,
        content: {
            flexGrow: 1,
            backgroundColor: theme.palette.background.default,
            padding: theme.spacing(3),
            height: "100vh",
            width: "100%",
            overflow: "hidden",
        },
        contentGrid: {
            height: "100%",
            width: "100%",
            flexWrap: "nowrap",
        },
    })
)
