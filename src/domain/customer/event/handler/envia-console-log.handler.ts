import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import AddressChangedEvent from "../address-changed.event";

export default class EnviaConsoleLogHandler
  implements EventHandlerInterface<AddressChangedEvent>
{
  handle(event: AddressChangedEvent): void {
    const { id, name, address } = event.eventData;
    const formattedAddress = `${address.street}, ${address.number} - ${address.city}, ${address.zip}`;
    console.log(
      `Endereço do client: ${id}, ${name} alterado para: ${formattedAddress}`
    );
  }
}
