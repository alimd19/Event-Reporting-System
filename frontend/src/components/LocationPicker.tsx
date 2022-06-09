import React, { useState, useEffect } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { Grid } from "@material-ui/core";
import { AppState } from "../lib/redux/store";
import { Location } from "../lib/types/location.types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { AppActions } from "../lib/types";
import { startSetLocation } from "../lib/redux/actions/locationActions";
import data from "../lib/data/userLocations";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
      width: "100%",
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(1),
      textAlign: "center",
      color: theme.palette.text.secondary,
    },
  })
);

interface State {
  rb: string | undefined;
  lb: string | undefined;
  center: string | undefined;
  options: {
    regionalBoards: string[] | null;
    localBoards: string[] | null;
    jklcs: string[] | null;
  };
  shrink: {
    rb: boolean;
    lb: boolean;
    center: boolean;
  };
}

interface LocationPickerProps {}

type Props = LocationPickerProps & LinkStateProps & LinkDispatchProps;

const LocationPicker: React.FC<Props> = (props) => {
  const classes = useStyles();

  const [values, setValues] = useState<State>({
    rb: props.initLoaction?.regionalBoard,
    lb: props.initLoaction?.localBoard,
    center: props.initLoaction?.jklc,
    options: {
      regionalBoards: props.initLoaction?.regionalBoard
        ? null
        : Object.keys(data),
      localBoards: props.initLoaction?.localBoard
        ? null
        : props.initLoaction?.regionalBoard
        ? Object.keys(data[props.initLoaction.regionalBoard])
        : null,
      jklcs: props.initLoaction?.jklc
        ? null
        : props.initLoaction?.localBoard && props.initLoaction?.regionalBoard
        ? Object.keys(
            data[props.initLoaction.regionalBoard][
              props.initLoaction.localBoard
            ]
          )
        : null,
    },
    shrink: {
      rb: false,
      lb: false,
      center: false,
    },
  });

  const handleChange = (prop: keyof State) => (
    event: React.ChangeEvent<{ name?: string | undefined; value: unknown }>
  ) => {
    setValues({
      ...values,
      [prop]: event.target.value,
    });
  };

  const { rb, lb, center } = values;

  useEffect(() => {
    setValues((v) => ({
      ...v,
      lb: "",
      center: "",
      options: {
        ...v.options,
        localBoards: v.rb ? Object.keys(data[v.rb]) : null,
        jklcs: null,
      },
    }));
  }, [rb, setValues]);

  useEffect(() => {
    setValues((v) => ({
      ...v,
      center: "",
      options: {
        ...v.options,
        jklcs: v.lb && v.rb ? data[v.rb][v.lb] : null,
      },
      shrink: {
        ...v.shrink,
        lb: true,
      },
    }));
  }, [lb, setValues]);

  const { startSetLocation } = props;

  useEffect(() => {
    startSetLocation({
      regionalBoard: rb,
      localBoard: lb,
      jklc: center,
    });
  }, [center, lb, rb, startSetLocation]);

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <FormControl
            variant="outlined"
            className={classes.formControl}
            disabled={props.userType !== "nt"}
          >
            <InputLabel id="demo-simple-select-filled-label">
              {props.initLoaction?.regionalBoard ? values.rb : "Region"}
            </InputLabel>
            <Select
              labelId="demo-simple-select-filled-label"
              id="demo-simple-select-filled"
              value={values.rb}
              onChange={handleChange("rb")}
              label={props.initLoaction?.regionalBoard ? values.rb : "Region"}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {values.options.regionalBoards &&
                values.options.regionalBoards?.length > 0 &&
                values.options.regionalBoards.map((region, index) => {
                  return (
                    <MenuItem key={index} value={region}>
                      {region}
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl
            variant="outlined"
            className={classes.formControl}
            disabled={props.userType !== "nt" && props.userType !== "rg"}
          >
            <InputLabel id="demo-simple-select-filled-label2">
              {props.location.localBoard
                ? "Local Board"
                : values.lb
                ? values.lb
                : "Local Board"}
            </InputLabel>
            {values.options.localBoards &&
            values.options.localBoards.length > 0 ? (
              <Select
                labelId="demo-simple-select-filled-label2"
                id="demo-simple-select-filled2"
                value={values.lb}
                onChange={handleChange("lb")}
                label="Local Board"
              >
                <MenuItem value="">
                  <em>All</em>
                </MenuItem>
                {values.options.localBoards.map((lb, index) => {
                  return (
                    <MenuItem key={index} value={lb}>
                      {lb}
                    </MenuItem>
                  );
                })}
              </Select>
            ) : (
              <Select
                labelId="demo-simple-select-filled-label2"
                id="demo-simple-select-filled2"
                value={values.lb}
                onChange={handleChange("lb")}
                label="Local Board"
              >
                <MenuItem value="">Please selact a region</MenuItem>
              </Select>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl
            variant="outlined"
            className={classes.formControl}
            disabled={props.userType === "jk"}
          >
            <InputLabel id="demo-simple-select-filled-label3">
              {props.location.jklc
                ? "Center"
                : values.center
                ? values.center
                : "Center"}
            </InputLabel>
            {values.options.jklcs && values.options.jklcs.length > 0 ? (
              <Select
                labelId="demo-simple-select-filled-label3"
                id="demo-simple-select-filled3"
                value={values.center}
                onChange={handleChange("center")}
                label="Center"
              >
                <MenuItem value="">
                  <em>All</em>
                </MenuItem>
                {values.options.jklcs.map((jklc, index) => {
                  return (
                    <MenuItem key={index} value={jklc}>
                      {jklc}
                    </MenuItem>
                  );
                })}
              </Select>
            ) : (
              <Select
                labelId="demo-simple-select-filled-label3"
                id="demo-simple-select-filled3"
                value={values.center}
                onChange={handleChange("center")}
                label="Center"
              >
                <MenuItem value="">Please selact a lb</MenuItem>
              </Select>
            )}
          </FormControl>
        </Grid>
      </Grid>
    </div>
  );
};

interface LinkStateProps {
  userType: string;
  location: Location;
  initLoaction: Location | undefined;
}

const mapStateToProps = (
  state: AppState,
  props: LocationPickerProps
): LinkStateProps => ({
  userType: state.user.userType,
  location: state.location,
  initLoaction: state.user.location,
});

interface LinkDispatchProps {
  startSetLocation: (location: Location) => void;
}

const mapDispatchToProps = (
  dispatch: ThunkDispatch<any, any, AppActions>,
  props: LocationPickerProps
): LinkDispatchProps => ({
  startSetLocation: bindActionCreators(startSetLocation, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(LocationPicker);
