import React, { useState, useContext } from "react";
import {
	TextField,
	InputAdornment,
	InputLabel,
	FormControl,
	FormLabel,
	RadioGroup,
	FormControlLabel,
	Radio,
	Select,
	MenuItem,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { AccountCircle, FilterList } from "@material-ui/icons";

import validator from "email-validator";
import parse from "html-react-parser";

import BreachContext from "./BreachContext";
import FilterContext from "./FilterContext";

const useStyles = makeStyles((theme) => ({
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
	},
	selectEmpty: {
		marginTop: theme.spacing(2),
	},
}));

const getBreach = async (account) => {
	console.log("getBreach()");
	const token = "12345"; // if auth is to be added between front / back ends
	const options = {
		method: "GET",
		// headers: {
		//   Authroization: `Bearer ${token}`
		// }
	};

	const url = `https://${process.env.API_URL}/breaches?account=${account}`;
	let res = [];
	await fetch(url, options)
		.then((response) => response.json())
		.then((data) => {
			console.log("data:");
			console.log(data);
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

	const { setBreachData } = useContext(BreachContext);

	const handleKeyUp = async (event) => {
		if (event.key === "Enter") {
			// validate email
			if (validator.validate(email)) {
				console.log("getting breach data");
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
			error={hasError}
			label="Check an Email"
			defaultValue=""
			helperText={errorText}
			onKeyUp={handleKeyUp}
			autoComplete="off"
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
	const [search, setSearch] = useState("");

	const { filter, setFilter } = useContext(FilterContext);
	const handleKeyUp = async (event) => {
		setFilter({ ...filter, searchBy: event.target.value });
	};

	return (
		<TextField
			label="Quick Search"
			defaultValue=""
			onKeyUp={handleKeyUp}
			autoComplete="off"
			variant="outlined"
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

	const handleChange = async (event) => {
		setFilter({ ...filter, severity: Number(event.target.value) });
		setValue(Number(event.target.value));
	};

	return (
		<FormControl component="fieldset">
			<FormLabel component="legend">Severity</FormLabel>
			<RadioGroup
				aria-label="severity"
				name="severity1"
				value={value}
				onChange={handleChange}
			>
				<FormControlLabel value={1} control={<Radio />} label="Low" />
				<FormControlLabel
					value={2}
					control={<Radio />}
					label="Medium"
				/>
				<FormControlLabel value={3} control={<Radio />} label="High" />
				<FormControlLabel
					value={4}
					control={<Radio />}
					label="Critical"
				/>
				<FormControlLabel
					value={0}
					control={<Radio />}
					label="Show All"
				/>
			</RadioGroup>
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
		<FormControl className={classes.formControl}>
			<InputLabel shrink id="demo-simple-select-placeholder-label-label">
				Sort By
			</InputLabel>
			<Select
				labelId="sortby_label"
				id="sortby_label"
				value={"name_asc"}
				onChange={handleChange}
				displayEmpty
				className={classes.selectEmpty}
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
		<FormControl component="fieldset">
			<FormLabel component="legend">Severity</FormLabel>
			<RadioGroup
				aria-label="severity"
				name="sortBy"
				value={value}
				onChange={handleChange}
			>
				<FormControlLabel
					value="name_asc"
					control={<Radio />}
					label="Name (asc)"
				/>
				<FormControlLabel
					value="name_desc"
					control={<Radio />}
					label="Name (desc)"
				/>
				<FormControlLabel
					value="severity_asc"
					control={<Radio />}
					label="Severity (asc)"
				/>
				<FormControlLabel
					value="severity_desc"
					control={<Radio />}
					label="Severity (desc)"
				/>
				<FormControlLabel
					value="impact_asc"
					control={<Radio />}
					label="Impact (asc)"
				/>
				<FormControlLabel
					value="impact_desc"
					control={<Radio />}
					label="Impact (desc)"
				/>
			</RadioGroup>
		</FormControl>
	);
};

export { CustomTextField, SearchTextField, SeverityFilter, SortBy };
