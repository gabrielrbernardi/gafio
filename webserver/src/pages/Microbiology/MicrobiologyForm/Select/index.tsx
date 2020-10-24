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
}

const Select: React.FC<Props> = ({ label, htmlFor, name }) => {
    return (
        <div className="form-row mt-4">
            <div className="col mr-2">
                <DropdownReact />
                <label htmlFor={htmlFor}>{label}</label>
                <br></br>
                <Dropdown
                    options={options}
                    placeholder="Selecione uma opção"
                    style={{ width: "100%" }}
                    required
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
                    autoFocus
                    required
                />
            </div>
        </div>
    );
};

export default Select;
