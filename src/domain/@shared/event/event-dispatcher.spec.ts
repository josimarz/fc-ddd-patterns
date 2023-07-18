import AddressChangedEvent from "../../customer/event/address-changed.event";
import CustomerCreatedEvent from "../../customer/event/customer-created.event";
import EnviaConsoleLog1Handler from "../../customer/event/handler/envia-console-log-1.handler";
import EnviaConsoleLog2Handler from "../../customer/event/handler/envia-console-log-2.handler";
import EnviaConsoleLogHandler from "../../customer/event/handler/envia-console-log.handler";
import SendEmailWhenProductIsCreatedHandler from "../../product/event/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "../../product/event/product-created.event";
import EventDispatcher from "./event-dispatcher";

describe("Domain events tests", () => {
  it("should register an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      1
    );
    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);
  });

  it("should unregister an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregister("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      0
    );
  });

  it("should unregister all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregisterAll();

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeUndefined();
  });

  it("should notify all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    const productCreatedEvent = new ProductCreatedEvent({
      name: "Product 1",
      description: "Product 1 description",
      price: 10.0,
    });

    // Quando o notify for executado o SendEmailWhenProductIsCreatedHandler.handle() deve ser chamado
    eventDispatcher.notify(productCreatedEvent);

    expect(spyEventHandler).toHaveBeenCalled();
  });

  it("should dispatch EnviaConsoleLog1Handler when CustomerCreatedEvent occurs", () => {
    const dispatcher = new EventDispatcher();
    const handler = new EnviaConsoleLog1Handler();
    const spyHandler = jest.spyOn(handler, "handle");
    dispatcher.register("CustomerCreatedEvent", handler);
    expect(
      dispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(handler);
    const event = new CustomerCreatedEvent({
      id: "1",
      name: "Epaminondas da Silva",
      active: true,
    });
    dispatcher.notify(event);
    expect(spyHandler).toHaveBeenCalled();
  });

  it("should dispatch EnviaConsoleLog2Handler when CustomerCreatedEvent occurs", () => {
    const dispatcher = new EventDispatcher();
    const handler = new EnviaConsoleLog2Handler();
    const spyHandler = jest.spyOn(handler, "handle");
    dispatcher.register("CustomerCreatedEvent", handler);
    expect(
      dispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(handler);
    const event = new CustomerCreatedEvent({
      id: "1",
      name: "Epaminondas da Silva",
      active: true,
    });
    dispatcher.notify(event);
    expect(spyHandler).toHaveBeenCalled();
  });

  it("should dispatch EnviaConsoleLogHandler when AddressChanged occurs", () => {
    const dispatcher = new EventDispatcher();
    const handler = new EnviaConsoleLogHandler();
    const spyHandler = jest.spyOn(handler, "handle");
    dispatcher.register("AddressChangedEvent", handler);
    expect(dispatcher.getEventHandlers["AddressChangedEvent"][0]).toMatchObject(
      handler
    );
    const event = new AddressChangedEvent({
      id: "1",
      name: "Epaminondas da Silva",
      address: {
        street: "Rua XV de Novembro",
        number: 500,
        city: "Blumenau",
        zip: "89023-000",
      },
    });
    dispatcher.notify(event);
    expect(spyHandler).toHaveBeenCalled();
  });
});
