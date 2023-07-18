import { Sequelize } from "sequelize-typescript";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import Product from "../../../../domain/product/entity/product";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import ProductModel from "../../../product/repository/sequelize/product.model";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  describe("create", () => {
    it("should create a new order", async () => {
      const customerRepository = new CustomerRepository();
      const customer = new Customer("123", "Customer 1");
      const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
      customer.changeAddress(address);
      await customerRepository.create(customer);

      const productRepository = new ProductRepository();
      const product = new Product("123", "Product 1", 10);
      await productRepository.create(product);

      const orderItem = new OrderItem(
        "1",
        product.name,
        product.price,
        product.id,
        2
      );

      const order = new Order("123", "123", [orderItem]);

      const orderRepository = new OrderRepository();
      await orderRepository.create(order);

      const orderModel = await OrderModel.findOne({
        where: { id: order.id },
        include: ["items"],
      });

      expect(orderModel.toJSON()).toStrictEqual({
        id: "123",
        customer_id: "123",
        total: order.total(),
        items: [
          {
            id: orderItem.id,
            name: orderItem.name,
            price: orderItem.price,
            quantity: orderItem.quantity,
            order_id: "123",
            product_id: "123",
          },
        ],
      });
    });
  });

  describe("update", () => {
    it("should update an order", async () => {
      const customer = new Customer("1", "Epaminondas");
      const address = new Address(
        "Rua XV de Novembro",
        512,
        "89023-000",
        "Blumenau"
      );
      customer.changeAddress(address);

      const customerRepository = new CustomerRepository();
      await customerRepository.create(customer);

      const product = new Product("1", "Chaveiro", 10.5);
      const productRepository = new ProductRepository();
      await productRepository.create(product);

      const orderItem = new OrderItem(
        "1",
        product.name,
        product.price,
        product.id,
        5
      );
      const order = new Order("1", customer.id, [orderItem]);

      const orderRepository = new OrderRepository();
      await orderRepository.create(order);

      order.items.push(
        new OrderItem("2", product.name, product.price, product.id, 10)
      );

      await orderRepository.update(order);

      const model = await OrderModel.findOne({
        where: { id: order.id },
        include: [{ model: OrderItemModel }],
      });

      expect(model.toJSON()).toStrictEqual({
        id: order.id,
        customer_id: order.customerId,
        total: order.total(),
        items: order.items.map((item) => ({
          id: item.id,
          product_id: item.productId,
          order_id: order.id,
          quantity: item.quantity,
          name: item.name,
          price: item.price,
        })),
      });
    });

    it("should throws an exception due to order not found", async () => {
      const customer = new Customer("1", "Epaminondas");
      const address = new Address(
        "Rua XV de Novembro",
        512,
        "89023-000",
        "Blumenau"
      );
      customer.changeAddress(address);

      const customerRepository = new CustomerRepository();
      await customerRepository.create(customer);

      const product = new Product("1", "Chaveiro", 10.5);
      const productRepository = new ProductRepository();
      await productRepository.create(product);

      const orderItem = new OrderItem(
        "1",
        product.name,
        product.price,
        product.id,
        5
      );
      const order = new Order("1", customer.id, [orderItem]);

      const orderRepository = new OrderRepository();
      expect(orderRepository.update(order)).rejects.toThrow(
        "Unable to update order"
      );
    });
  });

  describe("find", () => {
    it("should find an order by its id", async () => {
      const customer = new Customer("1", "Epaminondas");
      const address = new Address(
        "Rua XV de Novembro",
        512,
        "89023-000",
        "Blumenau"
      );
      customer.changeAddress(address);

      const customerRepository = new CustomerRepository();
      await customerRepository.create(customer);

      const product = new Product("1", "Chaveiro", 10.5);
      const productRepository = new ProductRepository();
      await productRepository.create(product);

      const orderItem = new OrderItem(
        "1",
        product.name,
        product.price,
        product.id,
        5
      );
      const order = new Order("1", customer.id, [orderItem]);

      const orderRepository = new OrderRepository();
      await orderRepository.create(order);

      const found = await orderRepository.find(order.id);
      expect(found).toStrictEqual(order);
    });

    it("should throws an exception due to order not found", async () => {
      const orderRepository = new OrderRepository();
      expect(orderRepository.find("1")).rejects.toThrow("Order not found");
    });
  });

  describe("findAll", () => {
    it("should return all orders from database", async () => {
      const customer = new Customer("1", "Epaminondas");
      const address = new Address(
        "Rua XV de Novembro",
        512,
        "89023-000",
        "Blumenau"
      );
      customer.changeAddress(address);

      const customerRepository = new CustomerRepository();
      await customerRepository.create(customer);

      const product = new Product("1", "Chaveiro", 10.5);
      const productRepository = new ProductRepository();
      await productRepository.create(product);

      const orderItem = new OrderItem(
        "1",
        product.name,
        product.price,
        product.id,
        5
      );
      const order = new Order("1", customer.id, [orderItem]);

      const orderRepository = new OrderRepository();
      await orderRepository.create(order);
      const orders = await orderRepository.findAll();
      expect(orders).toEqual(expect.arrayContaining([order]));
    });
  });
});
