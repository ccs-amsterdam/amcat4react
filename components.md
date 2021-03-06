## AmCAT4 React components documentation

Generated with `npx ts-node document.tsx`

1. [Main components](#main-components)
1. [Aggregation](#aggregation)
1. [Articles](#articles)
1. [Login & Index](#login--index)
1. [Queries](#queries)

## Main components

### Login

Filename: [src/lib/Login/Login.tsx](src/lib/Login/Login.tsx)
  
```
An AmCAT login form.
```
  
#### Props:

Name | Type | Required | Descriptipn
--- | --- | --- | ---
`value` | [AmcatUser](src/lib/interfaces.tsx#L68) | true | Current logged in user (if any)
`onLogin` | (amcat: [AmcatUser](src/lib/interfaces.tsx#L68)) => void | true | Callback that will be called on login (with a user)/logout (with undefined)
`fix_host` | string | false | If given, don't display the host field, but instead fix the host field to this value


### LoginForm

Filename: [/home/wva/amcat4react/src/lib/Login/LoginForm.tsx](/home/wva/amcat4react/src/lib/Login/LoginForm.tsx)
  
```
Form with login options that handles obtaining a token from an AmCAT backend
```
  
#### Props:

Name | Type | Required | Descriptipn
--- | --- | --- | ---
`value` | [AmcatUser](src/lib/interfaces.tsx#L68) | false | Current logged in user (if any)
`fix_host` | string | false | If given, don't display the host field, but instead fix the host field to this value
`onLogin` | (user: [AmcatUser](src/lib/interfaces.tsx#L68)) => void | true | Callback that will be called on succesful login


### IndexLogin

Filename: [/home/wva/amcat4react/src/lib/Login/IndexLogin.tsx](/home/wva/amcat4react/src/lib/Login/IndexLogin.tsx)
  
```
Show form to log in to a specific index on a specific host
```
  
#### Props:

Name | Type | Required | Descriptipn
--- | --- | --- | ---
`host` | string | true | Which host to log on to
`index` | string | true | Which index to use
`onLogin` | (index: AmcatIndex) => void | true | Callback after succesful login


### Query

Filename: [/home/wva/amcat4react/src/lib/Query/Query.tsx](/home/wva/amcat4react/src/lib/Query/Query.tsx)
  
```
Specify a full AmCAT **query**, i.e. querystrings and filters
```
  
#### Props:

Name | Type | Required | Descriptipn
--- | --- | --- | ---
`index` | AmcatIndex | true | 
`value` | [AmcatQuery](src/lib/interfaces.tsx#L39) | true | AmCAT query to be displayed, e.g. {"queries": [...], "filters": {...}}
`onSubmit` | (value: [AmcatQuery](src/lib/interfaces.tsx#L39)) => void | true | callback that will be called with a valid AmCAT query when the user clicks submit


### AggregateResult

Filename: [/home/wva/amcat4react/src/lib/Aggregate/AggregateResult.tsx](/home/wva/amcat4react/src/lib/Aggregate/AggregateResult.tsx)
  
```
Display the results of an aggregate search
```
  
#### Props:

Name | Type | Required | Descriptipn
--- | --- | --- | ---
`index` | AmcatIndex | true | 
`query` | [AmcatQuery](src/lib/interfaces.tsx#L39) | true | The query for the results to show
`options` | [AggregationOptions](src/lib/interfaces.tsx#L11) | true | Aggregation options (display and axes information)
`width` | string \| number | false | 
`height` | string \| number | false | 


### AggregateOptionsChooser

Filename: [/home/wva/amcat4react/src/lib/Aggregate/AggregateOptionsChooser.tsx](/home/wva/amcat4react/src/lib/Aggregate/AggregateOptionsChooser.tsx)
  
```
Form to select aggregation options (display, axes)
```
  
#### Props:

Name | Type | Required | Descriptipn
--- | --- | --- | ---
`index` | AmcatIndex | true | AmCAT index to work on
`value` | [AggregationOptions](src/lib/interfaces.tsx#L11) | true | Current aggregation options value, i.e. {display: "barchart", axes: [{field: "publisher"}]}
`onSubmit` | (value: [AggregationOptions](src/lib/interfaces.tsx#L11)) => void | true | Callback that will be called if aggregation options are set


### Article

Filename: [/home/wva/amcat4react/src/lib/Article/Article.tsx](/home/wva/amcat4react/src/lib/Article/Article.tsx)
  
```
Show a single article
```
  
#### Props:

Name | Type | Required | Descriptipn
--- | --- | --- | ---
`index` | AmcatIndex | true | 
`id` | number \| [number] | true | An article id. Can also be an array of length 1 with the article id, which can trigger setOpen if the id didn't change
`query` | [AmcatQuery](src/lib/interfaces.tsx#L39) | true | A query, used for highlighting


### Articles

Filename: [/home/wva/amcat4react/src/lib/Articles/Articles.tsx](/home/wva/amcat4react/src/lib/Articles/Articles.tsx)
  
```
Table overview of a subset of articles
```
  
#### Props:

Name | Type | Required | Descriptipn
--- | --- | --- | ---
`index` | AmcatIndex | true | 
`query` | [AmcatQuery](src/lib/interfaces.tsx#L39) | true | Query/filter of which documents to show
`columns` | PaginationTableColumn[] | false | an Array with objects indicating which columns to show and how
`allColumns` | boolean | false | if true, include all columns AFTER the columns specified in the columns argument


### LocationHeatmap

Filename: [/home/wva/amcat4react/src/lib/Location/LocationHeatmap.tsx](/home/wva/amcat4react/src/lib/Location/LocationHeatmap.tsx)
  
```
Heat map of documents displayed on a map
```
  
#### Props:

Name | Type | Required | Descriptipn
--- | --- | --- | ---
`index` | AmcatIndex | true | The index to run the query on
`query` | [AmcatQuery](src/lib/interfaces.tsx#L39) | false | An optional query to limit results
`options` | [LocationOptions](src/lib/interfaces.tsx#L96) | true | Additional options for location visualization ({field, numdocs})


### LocationPane

Filename: [/home/wva/amcat4react/src/lib/Location/LocationPane.tsx](/home/wva/amcat4react/src/lib/Location/LocationPane.tsx)
  
```
Pane that shows a linked LocationOptionChooser and LocationHeatMap
```
  
#### Props:

Name | Type | Required | Descriptipn
--- | --- | --- | ---
`index` | AmcatIndex | true | 
`query` | [AmcatQuery](src/lib/interfaces.tsx#L39) | true | 


### LocationOptionChooser

Filename: [/home/wva/amcat4react/src/lib/Location/LocationOptionChooser.tsx](/home/wva/amcat4react/src/lib/Location/LocationOptionChooser.tsx)
  
```
Form to select location options
```
  
#### Props:

Name | Type | Required | Descriptipn
--- | --- | --- | ---
`index` | AmcatIndex | true | 
`value` | [LocationOptions](src/lib/interfaces.tsx#L96) | true | 
`onChange` | (value: [LocationOptions](src/lib/interfaces.tsx#L96)) => void | true | 


---

## Aggregation

### AxisPicker

Filename: [src/lib/Aggregate/AxisPicker.tsx](src/lib/Aggregate/AxisPicker.tsx)
  
```
Dropdown to select an aggregation axis and possibly interval
```
  
#### Props:

Name | Type | Required | Descriptipn
--- | --- | --- | ---
`fields` | Field[] | true | index fields to choose from
`value` | [AggregationAxis](src/lib/interfaces.tsx#L6) | true | Current axis value
`onChange` | (value: [AggregationAxis](src/lib/interfaces.tsx#L6)) => void | true | Callback to set axis when user changes field or interval
`label` | string | false | 


### AggregateTable

Filename: [src/lib/Aggregate/AggregateTable.tsx](src/lib/Aggregate/AggregateTable.tsx)
  
```

```
  
#### Props:

Name | Type | Required | Descriptipn
--- | --- | --- | ---
`data` | AggregateData | true | *
The data to visualize
`onClick` | (value: any[]) => void | true | Callback when user clicks on a point,
should be an array of values of equal length to the # of axes
`width` | string \| number | false | 
`height` | string \| number | false | 


### AggregateLineChart

Filename: [src/lib/Aggregate/AggregateLineChart.tsx](src/lib/Aggregate/AggregateLineChart.tsx)
  
```

```
  
#### Props:

Name | Type | Required | Descriptipn
--- | --- | --- | ---
`data` | AggregateData | true | *
The data to visualize
`onClick` | (value: any[]) => void | true | Callback when user clicks on a point,
should be an array of values of equal length to the # of axes
`width` | string \| number | false | 
`height` | string \| number | false | 


### AggregatePane

Filename: [src/lib/Aggregate/AggregatePane.tsx](src/lib/Aggregate/AggregatePane.tsx)
  
```

```
  
#### Props:

Name | Type | Required | Descriptipn
--- | --- | --- | ---
`index` | AmcatIndex | true | 
`query` | [AmcatQuery](src/lib/interfaces.tsx#L39) | true | 


### AggregateBarChart

Filename: [/home/wva/amcat4react/src/lib/Aggregate/AggregateBarChart.tsx](/home/wva/amcat4react/src/lib/Aggregate/AggregateBarChart.tsx)
  
```

```
  
#### Props:

Name | Type | Required | Descriptipn
--- | --- | --- | ---
`data` | AggregateData | true | *
The data to visualize
`onClick` | (value: any[]) => void | true | Callback when user clicks on a point,
should be an array of values of equal length to the # of axes
`width` | string \| number | false | 
`height` | string \| number | false | 


---

## Articles

### PaginationTable

Filename: [src/lib/components/PaginationTable.tsx](src/lib/components/PaginationTable.tsx)
  
```
A nice table with pagination
```
  
#### Props:

Name | Type | Required | Descriptipn
--- | --- | --- | ---
`data` | TableRow[] | true | an Array with data for a single page
`columns` | PaginationTableColumn[] | true | an Array with objects indicating which columns to show and how.
`pages` | number | true | the number of pages
`pageChange` | (page: number) => void | true | the function to perform on pagechange. Gets pageindex as an argument, and should update data
`onClick` | (value: any) => void | true | Function to perform when clicking on a row. Gets data row object as argument


---

## Login & Index

### IndexCreate

Filename: [src/lib/Index/IndexCreate.tsx](src/lib/Index/IndexCreate.tsx)
  
```

```
  
#### Props:

Name | Type | Required | Descriptipn
--- | --- | --- | ---
`user` | [AmcatUser](src/lib/interfaces.tsx#L68) | true | An Amcat connection/user specification (e.g. from Login)
`open` | boolean | true | 
`onClose` | (name?: string) => void | true | 


### IndexDelete

Filename: [/home/wva/amcat4react/src/lib/Index/IndexDelete.tsx](/home/wva/amcat4react/src/lib/Index/IndexDelete.tsx)
  
```

```
  
#### Props:

Name | Type | Required | Descriptipn
--- | --- | --- | ---
`index` | AmcatIndex | true | 
`open` | boolean | true | 
`onClose` | (deleted: boolean) => void | true | 


---

## Queries

### KeywordField

Filename: [src/lib/Query/KeywordField.tsx](src/lib/Query/KeywordField.tsx)
  
```
Field for creating a values/keyword filter
```
  
#### Props:

Name | Type | Required | Descriptipn
--- | --- | --- | ---
`index` | AmcatIndex | true | an AmCAT index (to retrieve possible values)
`field` | string | true | the field name of the current field
`value` | AmcatFilter | true | the current value of the filter, e.g. {"values": ["nrc"]}
`onChange` | (value: AmcatFilter) => void | true | callback that will be called with a new filter value


### Filters

Filename: [/home/wva/amcat4react/src/lib/Query/Filters.tsx](/home/wva/amcat4react/src/lib/Query/Filters.tsx)
  
```
Define the filters for a query
Props:
```
  
#### Props:

Name | Type | Required | Descriptipn
--- | --- | --- | ---
`index` | AmcatIndex | true | 
`value` | [AmcatFilters](src/lib/interfaces.tsx#L35) | true | the current filters, e.g. {"publisher": {"values": ["nrc"]}}
`onChange` | (value: [AmcatFilters](src/lib/interfaces.tsx#L35)) => void | true | Callback that will be called when the filter selection changes with a new filter object
  (note that the filter might be incomplete, i.e. have only a key and an empty body if the user is still selecting)


### DateField

Filename: [/home/wva/amcat4react/src/lib/Query/DateField.tsx](/home/wva/amcat4react/src/lib/Query/DateField.tsx)
  
```
Field for creating a date filter
```
  
#### Props:

Name | Type | Required | Descriptipn
--- | --- | --- | ---
`field` | string | true | the field name of the current field
`value` | [DateFilter](src/lib/interfaces.tsx#L18) | true | the current value of the filter, e.g. {"gte": "2020-01-01"}
`onChange` | (value: [DateFilter](src/lib/interfaces.tsx#L18)) => void | true | callback that will be called with a new filter value


### FilterButton

Filename: [/home/wva/amcat4react/src/lib/Query/FilterButton.tsx](/home/wva/amcat4react/src/lib/Query/FilterButton.tsx)
  
```

```
  
#### Props:

Name | Type | Required | Descriptipn
--- | --- | --- | ---
`content` | any | true | 
`icon` | SemanticICONS | true | 
`field` | string | false | 
`disabled` | boolean | false | 
`onlyContent` | boolean | false | 
`style` | CSSProperties | false | 


### QueryString

Filename: [/home/wva/amcat4react/src/lib/Query/QueryString.tsx](/home/wva/amcat4react/src/lib/Query/QueryString.tsx)
  
```
Text area to set the query string(s)
props:
- value:
- onChange:
- rows: the number of rows (default: 7)
```
  
#### Props:

Name | Type | Required | Descriptipn
--- | --- | --- | ---
`value` | string | true | the current value (query strings) as a single text
`onChange` | (value: string) => void | true | will be called on every change with a new textual value
`rows` | number | false | the number of rows (default: 7)


---