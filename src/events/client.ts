import { GatewayDispatchPayload } from "discord-api-types/v10";
import { BaseEventEmitter, HandlerFunction } from "./event-emitter";
import { Transport, TransportOptions } from "./transport";
import { CamelCase } from "type-fest";

type ExtractEvent<O extends GatewayDispatchPayload, U extends O["t"]> = Extract<
  O & { t: Exclude<O["t"], Exclude<O["t"], U>> },
  { t: U }
>;

export type Events = {
  [P in GatewayDispatchPayload["t"] as `${CamelCase<P>}` | P]: [
    ExtractEvent<GatewayDispatchPayload, P>["d"]
  ];
};

export class EventClient extends BaseEventEmitter {
  public transport: Transport;
  // constructs
  constructor() {
    super();
    this.transport = new Transport(this);
  }

  public async start(options: TransportOptions) {
    await this.transport.start(options);
  }

  on<K extends keyof Events>(name: K, fn: HandlerFunction<Events[K]>): this {
    this.transport.subscribe(name);
    return super.on(name, fn);
  }
}