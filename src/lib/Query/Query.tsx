import { useEffect, useState } from "react";
import { Grid, Button, Icon } from "semantic-ui-react";
import QueryString from "./QueryString";
import Filter from "./Filter";
import { AmcatFilters, AmcatIndex, AmcatQuery } from "../interfaces";
import { queryFromString, queryToString } from "./libQuery";

interface QueryProps {
  index: AmcatIndex;
  /** AmCAT query to be displayed, e.g. {"queries": [...], "filters": {...}} */
  value: AmcatQuery;
  /** callback that will be called with a valid AmCAT query when the user clicks submit */
  onSubmit: (value: AmcatQuery) => void;
}

/**
 * Specify a full AmCAT **query**, i.e. querystrings and filters
 */
export default function Query({ index, value, onSubmit }: QueryProps) {
  const [queryStrings, setQueryStrings] = useState<string>();
  const [filters, setFilters] = useState<AmcatFilters>();

  // Is this the correct way to update the state if value changed?
  useEffect(() => {
    setQueryStrings(queryToString(value?.queries));
    setFilters(value?.filters || {});
  }, [value]);

  const onClick = () => {
    const q: AmcatQuery = {};
    // Split query string and remove empty queries
    q.queries = queryFromString(queryStrings);
    // Copy filters and remove empty filters
    const filtercopy = filters !== undefined ? { ...filters } : {};
    /*Object.keys(filtercopy)
      .filter((k) => Object.keys(filtercopy[k]).length === 0)
      .forEach((k) => delete filtercopy[k]);*/
    if (Object.keys(filtercopy).length !== 0) q.filters = filtercopy;
    console.log(JSON.stringify(q));
    onSubmit(q);
  };

  if (index == null) return null;

  return (
    <Grid style={{ marginBottom: "1em" }}>
      <Grid.Row>
        <Grid.Column floated="left" width={16}>
          <QueryString value={queryStrings} onChange={setQueryStrings} rows={5} />
          <Filter index={index} value={filters} onChange={setFilters} />
          {/*<Button.Group style={{ width: "100%", marginBottom: "10px" }}>
            <Filters index={index} value={filters} onChange={setFilters} />
          </Button.Group>{" "}*/}
          <Button fluid primary type="submit" onClick={onClick}>
            <Icon name="search" />
            Execute Query
          </Button>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}
