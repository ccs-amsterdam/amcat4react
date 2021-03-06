import Axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { SemanticICONS } from "semantic-ui-react";
import { AggregationOptions, AmcatDocument, AmcatField, AmcatFilters } from ".";
import { AmcatIndex, AmcatQuery, AmcatUser } from "./interfaces";

// Server-level functions, i.e. not linked to an index

function api_user(user: AmcatUser) {
  return Axios.create({
    baseURL: `${user.host}`,
    headers: { Authorization: `Bearer ${user.token}` },
  });
}

/** Get index details / check if an index exists */
export function getIndex(user: AmcatUser, index: string) {
  return api_user(user).get(`/index/${index}`);
}

/** Create an index */
export function createIndex(user: AmcatUser, name: string, guestRole = "NONE") {
  const body: any = { name: name };
  if (guestRole !== "NONE") body.guest_role = guestRole;
  return api_user(user).post(`/index/`, body);
}

/** Get the list of indices on this server */
export function getIndices(user: AmcatUser) {
  return api_user(user).get(`/index/`);
}

// Functions on an index

function api(index: AmcatIndex) {
  return Axios.create({
    baseURL: `${index.host}/index/${index.index}`,
    headers: { Authorization: `Bearer ${index.token}` },
  });
}

export function createDocuments(index: AmcatIndex, documents: AmcatDocument[], columns = {}) {
  // documentList should be an array of objects with at least the fields title, date and text
  return api(index).post(`/documents`, { documents, columns });
}

/** DELETE this index */
export function deleteIndex(index: AmcatIndex) {
  // This is silly, but using api(index) with url "" doesn't work :(
  return api_user(index).delete(`/index/${index.index}`);
}

/** POST an AmcatQuery and fetch the resulting articles */
export function postQuery(index: AmcatIndex, query: AmcatQuery, params: any) {
  return api(index).post("/query", { ...query, ...params });
}

/** List all fields in this index */
export function getFields(index: AmcatIndex) {
  return api(index).get("/fields");
}

/** Add fields to this index */
export function addFields(index: AmcatIndex, fields: AmcatField[]) {
  const body = Object.fromEntries(fields.map((f) => [f.name, f.type]));
  return api(index).post("/fields", body);
}

/** Get the values for a field
 * @param index Index name
 * @param field Field name
 */
export function getFieldValues(index: AmcatIndex, field: string) {
  return api(index).get(`/fields/${field}/values`);
}

/** POST an aggregate query to AmCAT
 * @param index Index name
 * @param query A Query to determine which documents will be aggregated (e.g. SQL where)
 * @param axes The aggregation axes (e.g. SQL group by)
 * @param setData Callback function that will be called with the data after a succesful call
 * @param setError Callback function that will be called with an error message on failure
 */
export function postAggregate(index: AmcatIndex, query: AmcatQuery, options: AggregationOptions) {
  const params: any = { ...query };
  if (options?.axes) params["axes"] = options.axes;
  if (options?.metrics) params["aggregations"] = options.metrics;
  return api(index).post(`/aggregate`, params);
}

/**
 * Get AmCAT token
 * @param {*} host      The amcat Host adress
 * @param {*} email     User email
 * @param {*} password  User password
 * @returns
 */
export async function getToken(host: string, email: string, password: string) {
  var d = new FormData();
  d.append("username", email);
  d.append("password", password);
  const response = await Axios.post(`${host}/auth/token`, d);
  return response.data.access_token;
}

/**
 * Refresh AmCAT token
 * @param {*} host      The amcat Host adress
 * @param {*} token     Token
 * @returns
 */
export function refreshToken(user: AmcatUser) {
  return api_user(user).get("/auth/token");
}

export function describeError(e: AxiosError): string {
  if (e.response) return `HTTP error ${e.response.status}`;
  if (e.request) return "No reply from server";
  return "Something went wrong trying to query the AmCAT backend";
}

export function addFilter(q: AmcatQuery, filters: AmcatFilters): AmcatQuery {
  if (q == null) q = {};
  return { queries: { ...q.queries }, filters: { ...q.filters, ...filters } };
}

/** Hook to get fields from amcat which allows for refreshing the cache
 * @param index Login information for this index
 * @returns a tuple [field objects, refresh callback]
 */
export function useFieldsWithRefresh(
  index: AmcatIndex | undefined
): [fields: AmcatField[], refresh: () => void] {
  function _getSetFields(
    index: AmcatIndex | undefined,
    setFields: (fields: AmcatField[]) => void
  ): void {
    if (index == null) setFields([]);
    else
      getFields(index)
        .then((res: any) => {
          setFields(Object.values(res.data));
        })
        .catch((_e: Error) => {
          setFields([]);
        });
  }

  const [fields, setFields] = useState<AmcatField[]>([]);
  useEffect(() => _getSetFields(index, setFields), [index]);
  const refresh = () => _getSetFields(index, setFields);
  return [Object.values(fields), refresh];
}

/** Hook to get fields from amcat
 * @param index Login information for this index
 * @returns a list of field objects
 */
export function useFields(index: AmcatIndex | undefined): AmcatField[] {
  return useFieldsWithRefresh(index)[0];
}

/*** Hook to get field values from AmCAT
 * @param index Login information for this index
 * @param field Name of the field
 * @returns a list of values (strings)
 */

export function useFieldValues(index: AmcatIndex, field: string): string[] {
  const [values, setValues] = useState([]);
  useEffect(() => {
    getFieldValues(index, field)
      .then((d) => setValues(d.data))
      .catch(() => {
        setValues(undefined);
      });
  }, [index, field, setValues]);
  return values;
}

export function getField(fields: AmcatField[], fieldname: string): AmcatField {
  const i = fields.map((f) => f.name).indexOf(fieldname);
  if (i === -1) return undefined;
  return fields[i];
}

const ICONS: { [field: string]: SemanticICONS } = {
  date: "calendar alternate outline",
  keyword: "list",
  long: "chart line",
  tag: "tags",
  text: "file text",
  url: "linkify",
  double: "sort numeric up",
  id: "id badge",
  object: "braille",
  geo_point: "location arrow",
};

export function getFieldTypeIcon(fieldtype: string) {
  return ICONS[fieldtype];
}

/** Update tags by query
 * @param index Index name
 * @param action add or remove
 * @param field Name of the tag field
 * @param tag Tag to add or remove
 * @param query A Query to determine which documents will be updated
 */
export function updateTags(
  index: AmcatIndex,
  action: "add" | "remove",
  field: string,
  tag: string,
  query: AmcatQuery
) {
  return api(index).post(`/tags_update`, { action, field, tag, ...query });
}
