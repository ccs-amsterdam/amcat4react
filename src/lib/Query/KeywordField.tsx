import { useEffect, useState } from "react";
import { Dropdown } from "semantic-ui-react";
import Amcat from "../apis/Amcat";
import { AmcatFilter } from "../interfaces";
import FilterButton from "./FilterButton";

interface KeywordFieldProps {
  /** an AmCAT instance (to retrieve possible values) */
  amcat: Amcat;
  /** the name of the current index */
  index: string;
  /** the field name of the current field */
  field: string;
  /** the current value of the filter, e.g. {"values": ["nrc"]} */
  value: AmcatFilter;
  /** callback that will be called with a new filter value */
  onChange: (value: AmcatFilter) => void;
}

/**
 * Field for creating a values/keyword filter
 */
export default function KeywordField({ amcat, index, field, value, onChange }: KeywordFieldProps) {
  const [fieldValues, setFieldValues] = useState<string[]>();
  useEffect(() => {
    amcat.getFieldValues(index, field, setFieldValues, (error) => setFieldValues(null));
  }, [amcat, index, field, setFieldValues]);
  if (!fieldValues) return null;

  const handleChange = (values: string[]) => {
    onChange(values.length === 0 ? {} : { values: values });
  };

  const keywords = value?.values || [];
  const content = keywords.join(", ") || "KEYWORD FILTER";
  const options = fieldValues.map((v) => ({ key: v, value: v, text: v }));
  return (
    <FilterButton field={field} content={content} onlyContent icon="list">
      <Dropdown
        open
        clearable
        value={keywords}
        fluid
        multiple
        selection
        search
        options={options}
        header={`Select keywords for field "${field}""`}
        style={{ minWidth: "300px" }}
        onChange={(e, d) => handleChange(d.value as string[])}
      />
    </FilterButton>
  );
}