import { useState, useEffect } from "react";
import { Dropdown, Button, DropdownItemProps } from "semantic-ui-react";
import { getIndices } from "../Amcat";
import { AmcatIndex, AmcatUser } from "../interfaces";

import IndexCreate from "./IndexCreate";
import IndexDelete from "./IndexDelete";

interface IndexPickerProps {
  user: AmcatUser;
  value: AmcatIndex;
  onChange: (index: AmcatIndex) => void;
}

export default function IndexPicker({ user, value, onChange }: IndexPickerProps) {
  const [options, setOptions] = useState<DropdownItemProps[]>([]);
  const canCreate = true;
  const canDelete = true;

  useEffect(() => {
    if (user != null) prepareOptions(user, value?.index, setOptions);
    else setOptions([]);
  }, [user, value, setOptions]);

  if (!user) return null;
  const setIndex = (name: string) => {
    value = { ...user, index: name };
    onChange(value);
  };

  const handleCreate = (name: string) => {
    prepareOptions(user, name, setOptions);
    setIndex(name);
  };
  const handleDelete = () => {
    prepareOptions(user, undefined, setOptions);
  };

  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: "1 1 auto" }}>
        <Dropdown
          placeholder="select index"
          fluid
          search
          selection
          value={value?.index}
          options={options}
          onChange={(e, d) => setIndex(d.value as string)}
        />
      </div>

      <div style={{ flex: "0 1 auto" }}>
        <Button.Group style={{ marginLeft: canDelete || canCreate ? "5px" : "0" }}>
          {!canCreate ? null : <IndexCreateButton user={user} onCreate={handleCreate} />}
          {!canDelete ? null : <IndexDeleteButton index={value} onDelete={handleDelete} />}
        </Button.Group>
      </div>
    </div>
  );
}

const buttonStyle = { paddingLeft: "5px", paddingRight: "5px" };

interface CreateButtonProps {
  user: AmcatUser;
  onCreate: (name: string) => void;
}

const IndexCreateButton = ({ user, onCreate }: CreateButtonProps) => {
  const [open, setOpen] = useState(false);
  const handleClose = (name: string) => {
    setOpen(false);
    if (name) {
      onCreate(name);
    }
  };
  return (
    <>
      <Button icon="plus" style={buttonStyle} onClick={() => setOpen(true)} />
      <IndexCreate user={user} onClose={handleClose} open={open} />
    </>
  );
};

interface DeleteButtonProps {
  index: AmcatIndex;
  onDelete: (index: AmcatIndex) => void;
}
const IndexDeleteButton = ({ index, onDelete }: DeleteButtonProps) => {
  const [open, setOpen] = useState(false);

  const handleDelete = (deleted: boolean) => {
    setOpen(false);
    // when a new index is delete, unselect it, and re-create options
    if (deleted) {
      onDelete(index);
    }
  };
  return (
    <>
      <Button disabled={!index} icon="minus" style={buttonStyle} onClick={() => setOpen(true)} />;
      <IndexDelete index={index} open={open} onClose={handleDelete} />;
    </>
  );
};

async function prepareOptions(
  user: AmcatUser,
  selected: string,
  setOptions: (options: DropdownItemProps[]) => void
) {
  try {
    const res = await getIndices(user);
    const options = res.data.map((ix: { name: string; role: string }) => {
      return {
        key: ix.name,
        value: ix.name,
        text: ix.name,
        description: ix.role,
        selected: ix.name === selected,
      };
    });
    setOptions(options);
  } catch (e) {
    console.log(e);
    setOptions([]);
  }
}
