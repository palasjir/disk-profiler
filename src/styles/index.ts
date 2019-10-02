import {createStyles, makeStyles, Theme} from "@material-ui/core"

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        dialog: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: theme.spacing(3, 2),
        },
        content: {
            padding: theme.spacing(3, 2),
        },
        buttonLeftIcon: {
            marginRight: theme.spacing(1),
        },
    })
)
