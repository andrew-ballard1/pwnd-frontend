import React, { useState, useContext } from "react";
import {
	TextField,
	InputAdornment,
	InputLabel,
	FormControl,
	Select,
	MenuItem,
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
import { AccountCircle, FilterList } from "@material-ui/icons";

import validator from "email-validator";

import BreachContext from "./BreachContext";
import FilterContext from "./FilterContext";

const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:3030";

const useStyles = makeStyles((theme) => ({
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
	},
	selectEmpty: {
		marginBottom: theme.spacing(1),
	},
}));

const getBreach = async (account) => {
	// const token = "12345"; // if auth is to be added between front / back ends
	const options = {
		method: "GET",
		// headers: {
		//   Authroization: `Bearer ${token}`
		// }
	};

	const url = `${API_URL}/breaches?account=${encodeURIComponent(account)}`;
	let res = [];
	await fetch(url, options)
		.then((response) => response.json())
		.then((data) => {
			res = data;
		})
		.catch((error) => {
			console.log(error);
		});

	return res;
};

const CustomTextField = () => {
	const [email, setEmail] = useState("");
	const [error, setError] = useState({ hasError: false, errorText: "" });
	const { hasError, errorText } = error;
	const classes = useStyles();

	const { setBreachData } = useContext(BreachContext);

	const handleKeyUp = async (event) => {
		if (event.key === "Enter") {
			// validate email
			if (validator.validate(email)) {
				const breachData = await getBreach(email);
				setBreachData(breachData);
			} else {
				setError({
					hasError: true,
					errorText: "Invalid Email Address",
				});
			}
		} else {
			setError({ hasError: false, errorText: "" });
			setEmail(event.target.value);
		}
	};

	return (
		<TextField
			className={classes.formControl}
			error={hasError}
			label="Check an Email"
			defaultValue=""
			helperText={errorText}
			onKeyUp={handleKeyUp}
			autoComplete="off"
			margin="dense"
			variant="outlined"
			InputProps={{
				startAdornment: (
					<InputAdornment position="start">
						<AccountCircle
							color={hasError ? "secondary" : "primary"}
						/>
					</InputAdornment>
				),
			}}
		/>
	);
};

const SearchTextField = () => {
	const { filter, setFilter } = useContext(FilterContext);
	const classes = useStyles();

    const handleKeyUp = async (event) => {
		setFilter({ ...filter, searchBy: event.target.value });
	};

	return (
		<TextField
			className={classes.formControl}
			label="Quick Search"
			defaultValue=""
			onKeyUp={handleKeyUp}
			autoComplete="off"
			variant="outlined"
			margin="dense"
			InputProps={{
				startAdornment: (
					<InputAdornment position="start">
						<FilterList color={"primary"} />
					</InputAdornment>
				),
			}}
		/>
	);
};

const SeverityFilter = () => {
	const [value, setValue] = React.useState(0);
	const { filter, setFilter } = useContext(FilterContext);

	const classes = useStyles();

	const handleChange = async (event) => {
		setFilter({ ...filter, severity: Number(event.target.value) });
		setValue(Number(event.target.value));
	};

	return (
		<FormControl variant="outlined" className={classes.formControl}>
			<InputLabel id="severity_input_label">Severity</InputLabel>
			<Select
				labelId="severity_label"
				id="severity_label"
				value={value}
				onChange={handleChange}
				margin="dense"
				label="Severity"
			>
				<MenuItem value={1}>Low</MenuItem>
				<MenuItem value={2}>Medium</MenuItem>
				<MenuItem value={3}>High</MenuItem>
				<MenuItem value={4}>Very High</MenuItem>
				<MenuItem value={5}>Critical</MenuItem>
				<MenuItem value={0}>Show All</MenuItem>
			</Select>
		</FormControl>
	);
};

const SortBy = () => {
	const [value, setValue] = React.useState("name_asc");
	const { filter, setFilter } = useContext(FilterContext);

	const classes = useStyles();

	const handleChange = async (event) => {
		setFilter({ ...filter, sortBy: event.target.value });
		setValue(event.target.value);
	};

	return (
		<FormControl variant="outlined" className={classes.formControl}>
			<InputLabel id="sortby_input_label">Sort By</InputLabel>
			<Select
				labelId="sortby_label"
				id="sortby_label"
				value={value}
				onChange={handleChange}
				margin="dense"
				label="Sort By"
			>
				<MenuItem value="name_asc">Name (asc)</MenuItem>
				<MenuItem value="name_desc">Name (desc)</MenuItem>
				<MenuItem value="severity_asc">Severity (asc)</MenuItem>
				<MenuItem value="severity_desc">Severity (desc)</MenuItem>
				<MenuItem value="impact_asc">Impact (asc)</MenuItem>
				<MenuItem value="impact_desc">Impact (desc)</MenuItem>
			</Select>
		</FormControl>
	);

	return (
		<FormControl>
			<InputLabel shrink id="demo-simple-select-placeholder-label-label">
				Sort By
			</InputLabel>
			<Select
				labelId="sortby_label"
				id="sortby_label"
				value={value}
				onChange={handleChange}
				variant="outlined"
				margin="dense"
				displayEmpty
			>
				<MenuItem value="name_asc">Name (asc)</MenuItem>
				<MenuItem value="name_desc">Name (desc)</MenuItem>
				<MenuItem value="severity_asc">Severity (asc)</MenuItem>
				<MenuItem value="severity_desc">Severity (desc)</MenuItem>
				<MenuItem value="impact_asc">Impact (asc)</MenuItem>
				<MenuItem value="impact_desc">Impact (desc)</MenuItem>
			</Select>
		</FormControl>
	);
};

export { CustomTextField, SearchTextField, SeverityFilter, SortBy };
