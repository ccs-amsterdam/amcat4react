import { useEffect, useState } from "react";
import { Table } from "semantic-ui-react";

/**
 *
 * @param {class}  amcat  An Amcat connection class, as obtained with amcat4auth
 * @param {string} index The name of an index
 * @param {object} query An object with query components (q, params, filter)
 */
export default function Aggregate({ amcat, index, filters, axes }) {
  const [data, setData] = useState();
  useEffect(() => {
    console.log(axes);
    if (axes === undefined || axes.length === 0) {
      setData(null);
    } else {
      fetchAggregate(amcat, index, axes, setData);
    }
  }, [amcat, index, axes, setData]);
  if (!data) return <pre>(Please select aggregate options)</pre>;
  console.log(data);
  return (
    <Table celled>
      <Table.Header>
        <Table.Row>
          {data.meta.axes.map((axis, i) => (
            <Table.HeaderCell key={i}>{axis.field}</Table.HeaderCell>
          ))}
          <Table.HeaderCell>N</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {data.data.map((row, i) => {
          return (
            <Table.Row key={i}>
              {data.meta.axes.map((axis, j) => (
                <Table.Cell key={j}>{row[axis.field]}</Table.Cell>
              ))}
              <Table.Cell>{row.n}</Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
}

async function fetchAggregate(amcat, index, axes, setData) {
  const result = await amcat.postAggregate(index, {}, {}, axes);
  console.log(result);
  setData(result.data);
}
