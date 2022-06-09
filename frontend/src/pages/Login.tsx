import React, { useState, FormEvent } from "react";
import clsx from "clsx";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { startSetUser } from "../lib/redux/actions/userActions";
import { bindActionCreators } from "redux";
import { AppActions } from "../lib/types";
import { User } from "../lib/types/user.types";
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
} from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { startSetLocation } from "../lib/redux/actions/locationActions";
import { Location } from "../lib/types/location.types";
import Logo from "../images/AKYSB_logo-01.png";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  textField: {
    width: "100%",
  },
  margin: {
    margin: theme.spacing(1),
    marginLeft: 0,
  },
  image: {
    backgroundImage: `url(${Logo})`,
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[600]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    height: "100vh",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

interface LoginProps {}

interface State {
  username: string;
  password: string;
  showPassword: boolean;
}

type Props = LoginProps & LinkDispatchProps;

const Login: React.FC<Props> = (props) => {
  const classes = useStyles();
  const [error, setError] = useState("");

  const [values, setValues] = React.useState<State>({
    username: "",
    password: "",
    showPassword: false,
  });

  const handleChange = (prop: keyof State) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setValues({ ...values, [prop]: event.target.value });
    setError("");
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    axios
      .post<User>(
        "http://localhost:3000/auth/login",
        { username: values.username, password: values.password },
        {
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        props.startSetUser(res.data);
        props.startSetLocation(res.data.location);
      })
      .catch((err) => {
        setError(err.response.data.message);
      });
  };

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={7} md={8} lg={9} className={classes.image} />
      <Grid
        item
        xs={12}
        sm={5}
        md={4}
        lg={3}
        component={Paper}
        elevation={6}
        square
      >
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Log in
          </Typography>
          <form className={classes.form} onSubmit={submitHandler}>
            <FormControl
              className={clsx(classes.margin, classes.textField)}
              error={error.includes("username")}
              variant="outlined"
            >
              <InputLabel htmlFor="username">Username</InputLabel>
              <OutlinedInput
                fullWidth
                id="username"
                type="text"
                value={values.username}
                onChange={handleChange("username")}
                required
                labelWidth={73}
              />
              {error.includes("username") && (
                <FormHelperText>Invalid username.</FormHelperText>
              )}
            </FormControl>
            <FormControl
              className={clsx(classes.margin, classes.textField)}
              error={error.includes("password")}
              variant="outlined"
            >
              <InputLabel htmlFor="outlined-adornment-password">
                Password
              </InputLabel>
              <OutlinedInput
                fullWidth
                id="outlined-adornment-password"
                type={values.showPassword ? "text" : "password"}
                value={values.password}
                onChange={handleChange("password")}
                required
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {values.showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                labelWidth={70}
              />
              {error.includes("password") && (
                <FormHelperText id="outlined-weight-helper-text">
                  Invalid password.
                </FormHelperText>
              )}
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Log In
            </Button>
          </form>
        </div>
      </Grid>
    </Grid>
  );
};

interface LinkDispatchProps {
  startSetUser: (user: User) => void;
  startSetLocation: (location: Location | undefined) => void;
}

const mapDispatchToProps = (
  dispatch: ThunkDispatch<any, any, AppActions>,
  props: LoginProps
): LinkDispatchProps => ({
  startSetUser: bindActionCreators(startSetUser, dispatch),
  startSetLocation: bindActionCreators(startSetLocation, dispatch),
});

export default connect(null, mapDispatchToProps)(Login);
