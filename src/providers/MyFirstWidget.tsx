import { useActiveViewport } from "@itwin/appui-react";
import React, { useEffect } from "react";
import RealityDataApi from "./RealityDataApi";
import "./MyFirstWidget.css";
import { Button, Flex, ToggleSwitch } from "@itwin/itwinui-react";
import { ColorDef, ContextRealityModelProps } from "@itwin/core-common";
import { ColorPickerButton } from "@itwin/imodel-components-react";
import { BuildingGroup, BuildingGroupListItem } from "./BuildingGroupComponent";

export const MyFirstWidget: React.FC = () => {
  const viewport = useActiveViewport();

  const [initialized, setInitialized] = React.useState<boolean>(false);
  const [realityModels, setRealityModelList] = React.useState<ContextRealityModelProps[]>([]);
  const [classifier, setClassifier] = React.useState<string>("");
  const [selectedBuildings, setSelectedBuildings] = React.useState<BuildingGroup[]>([]);

  useEffect(() => {
    const asyncInitialize = async () => {
      if (viewport) {
        const realityModels = await RealityDataApi.getRealityModels(viewport.iModel);
        setRealityModelList(realityModels);
        const classifiers = await RealityDataApi.getAvailableClassifierListForViewport(viewport);
        if(classifiers) {
          setClassifier(classifiers[0].value);
        }
      }
    };

    if (!initialized) {
      void asyncInitialize().then (() => { setInitialized(true);})
    }
  });

  const togglePhillyReality = async (e:React.ChangeEvent<HTMLInputElement>) => {
    if (viewport) {
      for (const model of realityModels) {
        if (model.name === "Philadelphia_2015") {
          RealityDataApi.toggleRealityModel(model, viewport, e.target.checked);
          RealityDataApi.setRealityDataClassifier(viewport, classifier);
        }
      }
    }
  }

  const addNewGroup = async () => {
    const newSelectedBuildings = [...selectedBuildings, 
      {name: "new " + selectedBuildings.length, color: ColorDef.fromString("#08227f"), buildings: []}]
    setSelectedBuildings(newSelectedBuildings);
  }

  const handleItemChange = (oldItem: BuildingGroup, newItem: BuildingGroup) => {
    const newList = selectedBuildings.map((item) => item.name === oldItem.name ? newItem : item);
    setSelectedBuildings(newList);
  }
  
  const buildingGroupList = selectedBuildings.map (
    (bg: BuildingGroup) => <BuildingGroupListItem item={bg} handleItemChange={handleItemChange}/>
  )

  return (
    <div>
      This is my first widget
      <Flex flexDirection="column">
        <ToggleSwitch onChange={togglePhillyReality} label='Philly Reality Data' />
        <Button onClick={addNewGroup}>Add New Group</Button>
        {buildingGroupList}
      </Flex>
    </div>
  );
};


