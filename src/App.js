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
import Masonry from "react-masonry-css";

import BreachContext from "./BreachContext";
import FilterContext from "./FilterContext";

import "./animations.css";
import tileShield from "./tile_shield.png";


// I'm new to Material UI, to me this massive block of "almost css" looks super bad, but I'm not sure
// where else to put it to maintain consistency. Didn't want to use inline styles, styledComponents, external css, etc, but here we are
const theme = createMuiTheme({
	overrides: {
		MuiCssBaseline: {
			".MuiFormControl-root": {
				margin: "10px",
			},
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
					backgroundColor: "#777",
					borderRadius: "4px",
				},
				".breachCard": {
					paddingLeft: "15px",
					paddingRight: "15px",
					borderRadius: "4px",
					boxShadow: "0px 2px 3px 0px rgba(255,255,255,0.1)",
					backgroundColor: "#555555",
				},
				".cardLogo": {
					width: "70px",
					height: "70px",
					boxShadow: "0px 4px 5px -2px rgba(0,0,0, 0.8)",
					borderRadius: "50%",
					backgroundSize: "70%",
					backgroundRepeat: "no-repeat",
					backgroundPosition: "center",
					backgroundColor: "rgba(255, 255, 255, 0.6)",
				},
				".cardFooter": {
					display: "flex",
					flexDirection: "row",
					alignItems: "space-between",
					width: "100%",
					marginTop: "15px",
					paddingBottom: "15px",
					textAlign: "center",
				},
				".my-masonry-grid": {
					display: "-webkit-box",
					display: "-ms-flexbox",
					display: "flex",
					marginLeft: "-30px",
					width: "auto",
					maxWidth: "930px",
				},
				".my-masonry-grid_column": {
					paddingLeft: "20px",
					backgroundClip: "padding-box",
				},
				".my-masonry-grid_column > div": {
					marginBottom: "20px",
				},
        ".gridContainer":{
          minHeight: "100vh",
          paddingTop: "50px",
          width: "100vw",
          overflow: "hidden",
          marginBottom: "50px",
        }
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
  // severity is the measure of how many types of data were found in a breach.
  // Email by itself would be low, Email plus username would be medium, etc
	const severity = ["...", "Low", "Medium", "High", "Very High"];
  
  if(data.length == 0){
    return [(<h1>No Breaches Detected!</h1>)]
  }

	let table = data.map((item, index) => {
		return (
			<div key={`card_${index}`} className={"breachCard"}>
				<div className={"cardHeader"}>
					<h2>{item.Name}</h2>
					<div
						style={{ backgroundImage: `url(${item.LogoPath})` }}
						className={"cardLogo"}
					></div>
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
	return table
};

const App = () => {
	// I'm specifically choosing contexts over component composition because
	// composition could get gross sending data between multiple nested levels AND a few components on the same level.
	// At some point this could be redesigned to use either, but its an excuse for me to try useContext - update, I love useContext.

  const [breachData, setBreachData] = useState({isClean: false, data: []});
	const [filter, setFilter] = useState({
		searchBy: "",
		severity: 0,
		sortBy: "name_asc",
	});

	const breachRef = { breachData, setBreachData };
	const filterRef = { filter, setFilter };

	useEffect(async () => {
    console.log(breachRef.breachData)
		setBreachData(breachRef.breachData);
	}, [breachRef.breachData, filter]);

	// Apply filters / sorting here
	const data = breachData
  const filteredData = breachData.data
		.filter((item) => {
			let returnVal = true;
			if (filter.searchBy !== "") {
				returnVal = false;
        
        // check items for partial matches to search string, when string not empty
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

			// how many types of data were breached, if we haven't ruled out this item with returnVal false
			if (returnVal) {
				returnVal = item.DataClasses.length >= filter.severity;
			}

			return returnVal;
		})
		.sort((a, b) => {
			if (filter.sortBy == "name_asc") {
				return a.Name.localeCompare(b.Name, "en", { numeric: true });
			}
			if (filter.sortBy == "name_desc") {
				return b.Name.localeCompare(a.Name, "en", { numeric: true });
			}
			if (filter.sortBy == "severity_asc") {
				return a.DataClasses.length - b.DataClasses.length;
			}
			if (filter.sortBy == "severity_desc") {
				return b.DataClasses.length - a.DataClasses.length;
			}
			if (filter.sortBy == "impact_asc") {
				return a.PwnCount - b.PwnCount;
			}
			if (filter.sortBy == "impact_adec") {
				return b.PwnCount - a.PwnCount;
			}
		});

	const breachTitles = [
		"Breach Data",
		"Here's what we found",
		"Could be worse",
		"Alright, here's the deal",
	];

	return (
    // I'm not sure if I could put both these contexts into one comoponent or not, but it seems like there needs to 
    // be a balance between how much you use useContext and considering other design patterns. No idea what the balance is though
		<BreachContext.Provider value={breachRef}>
			<FilterContext.Provider value={filterRef}>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<Grid
						container
						direction="column"
						justify="flex-start"
						wrap="nowrap"
						alignItems="center"
            className="gridContainer"
					>
						<Grid
							item
							style={{ marginTop: "40vh" }}
						>
							<div
								className={"animatedBackground"}
								style={{
									backgroundOpacity: "0.5",
									backgroundImage: `url(${tileShield})`,
								}}
							>
								<div>
									<h1 style={{ fontSize: "50px", textShadow: "2px 2px 8px black" }}>
										Check your email for security breaches
									</h1>
									<p style={{ fontSize: "16px", textShadow: "2px 0px 8px black" }}>
										Although, maybe consider NOT entering
										your email on random websites.
										<br />
										That's how this mess got started.
									</p>
								</div>
							</div>
							<CustomTextField />
							<SearchTextField />
							<SeverityFilter />
							<SortBy />
						</Grid>
						<Grid item>
              {data.isClean && filteredData.length === 0 && (
                <h1 style={{
                    display: "flex",
                    alignSelf: "center",
                    textAlign: "center",
                  }}>No breaches detected!</h1>
                )
              }
              {!data.isClean && filteredData.length === 0 && (
                <h1 style={{
                    display: "flex",
                    alignSelf: "center",
                    textAlign: "center",
                  }}>There's nothing here</h1>
                )
              }

							{!data.isClean && filteredData.length > 0 && (
								<div>
									<h1
										style={{
											display: "flex",
											alignSelf: "center",
											textAlign: "center",
										}}
									>
										{breachTitles[Math.floor(Math.random() * breachTitles.length)]}
									</h1>
									<div
										style={{
											width: "90vw",
											margin: "auto",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
										}}
									>
										<Masonry
											breakpointCols={3}
											className="my-masonry-grid"
											columnClassName="my-masonry-grid_column"
										>
											{BreachTable(filteredData)}
										</Masonry>
									</div>
								</div>
							)}
						</Grid>
					</Grid>
				</ThemeProvider>
			</FilterContext.Provider>
		</BreachContext.Provider>
	);
};

export default App;
