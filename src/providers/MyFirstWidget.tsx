import { useActiveViewport } from "@itwin/appui-react";
import React, { useEffect } from "react";
import RealityDataApi from "./RealityDataApi";
import "./MyFirstWidget.css";
import { Button, ToggleSwitch } from "@itwin/itwinui-react";
import { ContextRealityModelProps } from "@itwin/core-common";

export const MyFirstWidget: React.FC = () => {
  const viewport = useActiveViewport();

  const [initialized, setInitialized] = React.useState<boolean>(false);
  const [realityModels, setRealityModelList] = React.useState<ContextRealityModelProps[]>([]);
  const [classifier, setClassifier] = React.useState<string>("");
  const [listOfThings, setListOfThings] = React.useState<string[]>([]);

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

  const addBanana = async () => {
    setListOfThings([...listOfThings, "Banana!"])
  }

  const addApple = async () => {
    setListOfThings([...listOfThings, "Apple!"])
  }

  const removeTop = async () => {
    setListOfThings(listOfThings.splice(1))
  }

  const thingList = listOfThings.map((thing: string) => <li>{thing}</li>)

  return (
    <div>
      This is my first widget
      <ToggleSwitch onChange={togglePhillyReality} label='Philly Reality Data' />
      <Button onClick={addBanana}>Add Banana</Button>
      <Button onClick={addApple}>Add Apple</Button>
      <Button onClick={removeTop}>Remove Top</Button>
      <ul>
        {thingList}
      </ul>
    </div>
  );
};


