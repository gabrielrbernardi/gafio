import React from "react";
import { Dropdown } from "primereact/dropdown";
import { Dropdown as DropdownReact } from "react-bootstrap";

const options = [
    { label: "Sim", value: "S" },
    { label: "Não", value: "N" },
];

interface Props {
    label: string;
    htmlFor: string;
    name: string;
    value: string;
    inputValue: any;
    onChange: any;
    inputOnChange:any;
}

const Select: React.FC<Props> = ({
    label,
    htmlFor,
    name,
    value,
    inputValue,
    onChange,
    inputOnChange,
}) => {
    return (
        <div className="form-row mt-4">
            <div className="col mr-2">
                <DropdownReact />
                <label htmlFor={htmlFor}>{label}</label>
                <br></br>
                <Dropdown
                    options={options}
                    placeholder="Selecione uma opção"
                    value={value}
                    onChange={onChange}
                    style={{ width: "100%" }}
                />
                <DropdownReact />
            </div>
            <div className="col">
                <label htmlFor={name}>Observações</label>
                <input
                    type="text"
                    className="form-control"
                    id={name}
                    name={name}
                    placeholder="Observação"
                    defaultValue={inputValue}
                    onChange={inputOnChange}
                    autoFocus
                />
            </div>
        </div>
    );
};

export default Select;
