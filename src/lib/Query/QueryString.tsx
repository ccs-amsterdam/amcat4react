import { useState } from "react";
import { TextArea, Form, Modal } from "semantic-ui-react";

interface QueryStringProps {
  /** the current value (query strings) as a single text */
  value: string;
  /** will be called on every change with a new textual value */
  onChange: (value: string) => void;
  /** the number of rows (default: 7) */
  rows?: number;
}

/**
 * Text area to set the query string(s)
 * props:
 * - value:
 * - onChange:
 * - rows: the number of rows (default: 7)
 */
export default function QueryString({ value, onChange, rows }: QueryStringProps) {
  return (
    <Form style={{ marginBottom: "2em", width: "100%" }}>
      <TextArea
        value={value}
        width={16}
        placeholder="Query..."
        onChange={(e, d) => onChange(d.value as string)}
        rows={rows || 7}
      />
      <QueryHelp />
    </Form>
  );
}

const QueryHelp = () => {
  const [open, setOpen] = useState(false);

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={
        <i
          style={{
            cursor: "pointer",
            color: "#1f61f9",
            float: "right",
          }}
        >
          Query help
        </i>
      }
    >
      <Modal.Header>Query help</Modal.Header>
      <Modal.Content>
        <p>
          If there is no boolean operator between two terms, the OR operator is used. Therefore, the
          query "a b" is parsed as "a OR b".
        </p>
        <h4>Search Identifier</h4>
        <p>
          identifier#query = separate the identifier from the query with the # character, such as
          pvda#pvda OR "wouter bos" OR "partij van de arbeid" The query identifier can be used in
          further queries, marked with [brackets]. Example: partijen#[pvda] OR [cda] (where pvda and
          cda have been previously defined)
        </p>
        <h4>Wildcards</h4>
        <p>
          ? = Single character wildcard, like te?t will find both test and text * = Multiple
          character wildcard, like mosl* will find moslim, moslims, etc.
        </p>
        <p>Note: You can not start a term with a wildcard</p>
        <h4>Proximity Search</h4>
        <p>"word1 word2"~10 = Search with word distance 10 between word1 and word2</p>
        <p>
          "(word1 OR word2 OR word*) word3"~5 = Search with word distance 5 between word1 OR word2
          OR word*, and word3
        </p>
        <h4>Fuzzy Search</h4>
        <p>
          koe~ or koe~0.9 = fuzzy search where the value should be between 0 (low similarity) and 1
          (high similarity)
        </p>
        <h4>NOT</h4>
        <p>
          word1 NOT (word2 word3) = Search for documents containing word1 and not word2 and not
          word3
        </p>
        <h4>Headline only</h4>
        <p>Use headline:keyword to only search the headline for "keyword"</p>

        <a href="https://lucene.apache.org/core/3_4_0/queryparsersyntax.html">
          More info about the Lucene query syntax
        </a>
      </Modal.Content>
    </Modal>
  );
};
