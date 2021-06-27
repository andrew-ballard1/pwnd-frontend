import React, { useEffect, useState } from "react";
import { ThemeProvider, CssBaseline, Grid, Tooltip } from "@material-ui/core";

import { createMuiTheme } from "@material-ui/core/styles";
import { HelpOutline, CheckCircleOutline } from "@material-ui/icons";
import { red, green, grey, blue } from "@material-ui/core/colors";
import {
	CustomTextField,
	SearchTextField,
	SeverityFilter,
	SortBy,
} from "./inputFields";

import parse from "html-react-parser";

import BreachContext from "./BreachContext";
import FilterContext from "./FilterContext";

const theme = createMuiTheme({
	overrides: {
		MuiCssBaseline: {
			"@global": {
				a: {
					color: "#bbddff",
				},
				".cardHeader": {
					borderBottom: "1px rgba(255, 255, 255, 0.4) solid",
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
					padding: "15px",
					marginLeft: "-15px",
					marginRight: "-15px",
					marginBottom: "15px",
				},
				".breachCard": {
					paddingLeft: "15px",
					paddingRight: "15px",
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
					borderRadius: "4px",
					boxShadow: "0px 2px 3px 0px rgba(255,255,255,0.1)",
					backgroundColor: "#444",
					width: "90%",
					minHeight: "300px",
					margin: "15px",
					alignSelf: "center",
				},
				".cardLogo": {
					width: "50px",
					height: "50px",
					border: "1px white solid",
					borderRadius: "4px",
					backgroundSize: "70%",
					backgroundRepeat: "no-repeat",
					backgroundPosition: "center",
				},
				".cardFooter": {
					display: "flex",
					flexDirection: "row",
					alignSelf: "flex-start",
					alignItems: "space-between",
				},
			},
		},
	},
	palette: {
		type: "dark",
		primary: {
			main: grey[50],
		},
		secondary: {
			main: grey[500],
		},
		error: {
			main: red[500],
		},
		success: {
			main: green[500],
		},
		info: {
			main: blue[500],
		},
	},
});

const BreachTable = (data) => {
	const severity = ["...", "Low", "Medium", "High", "Very High"];

	let table = data.map((item, index) => {
		return (
			<div key={`card_${index}`} className={"breachCard"}>
				<div className={"cardHeader"}>
					<div
						style={{ backgroundImage: `url(${item.LogoPath})` }}
						className={"cardLogo"}
					></div>
					<h3>{item.Name}</h3>
					<Tooltip
						title={item.IsVerified ? "Verified" : "Unverified"}
						arrow
						left
					>
						{item.IsVerified ? (
							<CheckCircleOutline />
						) : (
							<HelpOutline />
						)}
					</Tooltip>
				</div>
				<div>
					<div>{item.Title}</div>
					<div>{parse(item.Description)}</div>
				</div>
				<div className={"cardFooter"}>
					<div style={{ marginRight: "10px" }}>
						Impact: {item.PwnCount.toLocaleString()}
					</div>
					<div style={{ marginRight: "10px" }}>
						Severity:{" "}
						{item.DataClasses.length < 5
							? severity[item.DataClasses.length]
							: "Critical"}
					</div>
					<div style={{ marginRight: "10px" }}>
						Breached On: {item.BreachDate.toLocaleString()}
					</div>
				</div>
			</div>
		);
	});
	return table;
};

const App = () => {
	// I'm specifically choosing useContext over component composition because
	// composition could get gross sending data between multiple nested levels AND a few components on the same level.

	// At some point this could be redesigned to use either, but its an excuse for me to try useContext - update, I love useContext.
	// I think I hate material-ui though, at least until I don't have to hit documentation every 2 minutes
	
  const [breachData, setBreachData] = useState([]);
	const [filter, setFilter] = useState({
		searchBy: "",
		severity: 0,
		sortBy: "name_asc",
	});
	const breachRef = { breachData, setBreachData };
	const filterRef = { filter, setFilter };

  useEffect(async () => {
		console.log("changing data");
		setBreachData(breachRef.breachData);
	}, [breachRef.breachData, filter]);

	const data = breachData.filter((item) => {
		// handle checkbox, text search here
		console.log(filter);
		let returnVal = true;
		if (filter.searchBy !== "") {
			returnVal = false;
			if (
				item.Name.toLowerCase().indexOf(
					filter.searchBy.toLowerCase().trim()
				) !== -1
			) {
				returnVal = true;
			}
		} else {
			returnVal = true;
		}

		// how many types of data were breached
		if (returnVal) {
			returnVal = item.DataClasses.length >= filter.severity;
		}

		return returnVal;
  }).sort((a, b) => {
    if(filter.sortBy == 'name_asc'){
      return a.Name.localeCompare(b.Name, 'en', { numeric: true })
    }
    if(filter.sortBy == 'name_desc'){
      return b.Name.localeCompare(a.Name, 'en', { numeric: true })
    }
    if(filter.sortBy == 'severity_asc'){
      return a.DataClasses.length - b.DataClasses.length
    }
    if(filter.sortBy == 'severity_desc'){
      return b.DataClasses.length - a.DataClasses.length
    }
    if(filter.sortBy == 'impact_asc'){
      return a.PwnCount - b.PwnCount
    }
    if(filter.sortBy == 'impact_adec'){
      return b.PwnCount - a.PwnCount
    }
	});

	return (
		<BreachContext.Provider value={breachRef}>
			<FilterContext.Provider value={filterRef}>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<Grid
						container
						direction="column"
						justify="center"
						wrap="nowrap"
						alignItems="center"
						style={{ minHeight: "100vh", paddingTop: "45vh" }}
					>
						<Grid item wrap="nowrap" direction="row">
							<CustomTextField />
							<SearchTextField />
							<SeverityFilter />
							<SortBy />
						</Grid>
						<Grid item>
							<div>
								{data.length > 0 && (
									<div
										style={{
											display: "flex",
											flexDirection: "column",
											flexWrap: "no-wrap",
										}}
									>
										<h2>Breach Data</h2>
										<div
											style={{
												display: "flex",
												flexDirection: "column",
												width: "100vw",
												flexWrap: "no-wrap",
											}}
										>
											{BreachTable(data)}
										</div>
									</div>
								)}
							</div>
						</Grid>
					</Grid>
				</ThemeProvider>
			</FilterContext.Provider>
		</BreachContext.Provider>
	);
};

export default App;

