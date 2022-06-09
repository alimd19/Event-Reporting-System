import React, { ReactChild } from "react";
import clsx from "clsx";
import { makeStyles, Theme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MenuIcon from "@material-ui/icons/Menu";
import Hidden from "@material-ui/core/Hidden";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Container,
  Menu,
  MenuItem,
  withStyles,
} from "@material-ui/core";
import Axios from "axios";
import { connect } from "react-redux";
import { User } from "../lib/types/user.types";
import { bindActionCreators } from "redux";
import { AppActions } from "../lib/types";
import { ThunkDispatch } from "redux-thunk";
import { startSetUser } from "../lib/redux/actions/userActions";
import { useHistory } from "react-router-dom";

const drawerWidth = 150;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
  },
  drawerPaper: {
    width: drawerWidth,
    position: "fixed",
    [theme.breakpoints.up("xs")]: {
      top: "60px",
      margin: "auto",
      maxWidth: "20%",
      minWidth: "160px",
    },
    [theme.breakpoints.down("xs")]: {
      top: "0px",
    },
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(1),
  },
  container: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(4),
  },
  appBarSpacer: theme.mixins.toolbar,
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  listItem: {
    paddingLeft: "0px",
    paddingRight: "0px",
  },
  icons: {
    minWidth: "25px",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    width: "100%",
    maxHeight: "64px",
  },
  button: {
    margin: theme.spacing(1),
    color: "white",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  title: {
    flexGrow: 1,
  },
  text: {
    fontSize: "1.5rem",
    [theme.breakpoints.down("sm")]: {
      fontSize: "1.1rem",
    },
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  mis: {
    marginRight: theme.spacing(2),
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
}));

const styles = {
  label: {
    justifyContent: "flex-end",
  },
};

interface DashboardProps {
  username: string;
  children: ReactChild;
}

interface Classes {
  classes: any;
}

type Props = DashboardProps & LinkDispatchProps & Classes;

export const Dashboard: React.FC<Props> = (props) => {
  const history = useHistory();
  const classes = useStyles();

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLButtonElement>(
    null
  );
  const isMenuOpen = Boolean(anchorEl);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handelMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const logoutHandler = () => {
    handleMenuClose();
    Axios.post("http://localhost:3000/auth/logout")
      .then(() => {
        props.startSetUser({
          username: "",
          userId: "",
          userType: "",
          location: { regionalBoard: "", localBoard: "", jklc: "" },
          budgetId: "",
        });
        history.push("/login");
      })
      .catch((err) => console.log(err));
  };

  const drawer = (
    <div className={classes.toolbarIcon}>
      <Divider />
      <List>
        <ListItem button className={classes.listItem}>
          <ListItemIcon className={classes.icons}>
            <i className="fa fa-tasks" aria-hidden="true"></i>
          </ListItemIcon>
          <ListItemText primary="Youth Members" />
        </ListItem>
        <ListItem button className={classes.listItem}>
          <ListItemIcon className={classes.icons}>
            <i className="fa fa-users" aria-hidden="true"></i>
          </ListItemIcon>
          <ListItemText primary="Programs" />
        </ListItem>
        <ListItem button className={classes.listItem}>
          <ListItemIcon className={classes.icons}>
            <i className="fa fa-bullseye" aria-hidden="true"></i>
          </ListItemIcon>
          <ListItemText primary="Budget" />
        </ListItem>
      </List>
    </div>
  );

  const renderMenu = (
    <Menu
      id="menu-appbar"
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      getContentAnchorEl={null}
      keepMounted
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={logoutHandler}>Logout</MenuItem>
    </Menu>
  );

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar)}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h3"
            variant="h3"
            color="inherit"
            noWrap
            className={clsx(classes.text, classes.mis)}
          >
            MIS 2.0
          </Typography>
          <Typography
            component="h3"
            variant="h6"
            color="inherit"
            align="center"
            className={clsx(classes.title, classes.text)}
          >
            Aga Khan Youth and Sports Board for India
          </Typography>
          <Button
            className={classes.button}
            classes={{ label: props.classes.label }}
            startIcon={<FontAwesomeIcon icon={faUserCircle} />}
            onClick={handelMenu}
          >
            {props.username}
          </Button>
        </Toolbar>
      </AppBar>
      {renderMenu}
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open={true}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsUp implementation="css">
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            anchor="left"
            classes={{
              paper: clsx(classes.drawerPaper),
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          {props.children}
        </Container>
      </main>
    </div>
  );
};

interface LinkDispatchProps {
  startSetUser: (user: User) => void;
}

const mapDispatchToProps = (
  dispatch: ThunkDispatch<any, any, AppActions>,
  props: DashboardProps
): LinkDispatchProps => ({
  startSetUser: bindActionCreators(startSetUser, dispatch),
});

export default connect(null, mapDispatchToProps)(withStyles(styles)(Dashboard));
