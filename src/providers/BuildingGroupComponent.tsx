import { useActiveViewport } from "@itwin/appui-react";
import { Id64Array } from "@itwin/core-bentley";
import { ColorDef } from "@itwin/core-common";
import { ColorPickerButton } from "@itwin/imodel-components-react";
import { Button } from "@itwin/itwinui-react";

export interface BuildingGroup {
    name: string;
    color: ColorDef;
    buildings: Id64Array;
}

export interface GroupListItemProps {
    item: BuildingGroup;
    handleItemChange: (oldItem: BuildingGroup, newItem: BuildingGroup) => void;
}

export const BuildingGroupListItem: React.FC<GroupListItemProps> = ({
    item,
    handleItemChange,
}: GroupListItemProps) => {
    const viewport = useActiveViewport();

    const saveBuilding = async () => {
        if (viewport?.iModel.selectionSet.isActive) { // If something is selected
            const newSelectedBuildings = [...item.buildings, ...viewport.iModel.selectionSet.elements]; // Merge the current saved selection with what is currently selected
            handleItemChange(item, { ...item, buildings: newSelectedBuildings })
        }
    }

    const selectSavedBuildings = async () => {
        if (viewport) {
            viewport.iModel.selectionSet.emptyAll();
            viewport.iModel.selectionSet.add(item.buildings);
            viewport.hilite = {...viewport.hilite, color: item.color};
        }
    }

    const clearSelectedBuildings = async () => {
        if (viewport) {
            viewport.iModel.selectionSet.emptyAll();
            viewport.iModel.selectionSet.add([]);
        }
        handleItemChange(item, { ...item, buildings: [] });
    }
    const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newItem = { ...item, name: e.target.value };
        handleItemChange(item, newItem);
    }

    const onColorChange = async (newColor: ColorDef) => {
        const newItem = {...item, color: newColor}
        handleItemChange(item, newItem);
      }
    
    const zoom = async () => {
        if (viewport)
            viewport.zoomToElements(item.buildings)
    }

    return (
        <div>
            <ColorPickerButton initialColor={item.color} onColorPick={onColorChange}/>
            <input type="text" value={item.name} onChange={onNameChange} />
            <Button onClick={saveBuilding}>Save</Button>
            <Button onClick={selectSavedBuildings}>Select Saved</Button>
            <Button onClick={clearSelectedBuildings}>Clear</Button>
            <Button onClick={zoom}>Zoom</Button>
        </div>
    )
}