import { Container } from "inversify";
import { Logger } from "../core";
import { IOCTYPES } from "./ioc.types";
import { ILogger } from "../common";

const container = new Container({ defaultScope: "Singleton" });

container.bind<ILogger>(IOCTYPES.Logger).to(Logger);
