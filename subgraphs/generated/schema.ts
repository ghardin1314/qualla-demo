// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Address,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class SubscriptionFactory extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save SubscriptionFactory entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save SubscriptionFactory entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("SubscriptionFactory", id.toString(), this);
  }

  static load(id: string): SubscriptionFactory | null {
    return store.get("SubscriptionFactory", id) as SubscriptionFactory | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get master(): string | null {
    let value = this.get("master");
    if (value === null) {
      return null;
    } else {
      return value.toString();
    }
  }

  set master(value: string | null) {
    if (value === null) {
      this.unset("master");
    } else {
      this.set("master", Value.fromString(value as string));
    }
  }

  get fee(): i32 {
    let value = this.get("fee");
    return value.toI32();
  }

  set fee(value: i32) {
    this.set("fee", Value.fromI32(value));
  }

  get contracts(): Array<string> | null {
    let value = this.get("contracts");
    if (value === null) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set contracts(value: Array<string> | null) {
    if (value === null) {
      this.unset("contracts");
    } else {
      this.set("contracts", Value.fromStringArray(value as Array<string>));
    }
  }
}

export class SubscriptionContract extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(
      id !== null,
      "Cannot save SubscriptionContract entity without an ID"
    );
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save SubscriptionContract entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("SubscriptionContract", id.toString(), this);
  }

  static load(id: string): SubscriptionContract | null {
    return store.get("SubscriptionContract", id) as SubscriptionContract | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get publisher(): string | null {
    let value = this.get("publisher");
    if (value === null) {
      return null;
    } else {
      return value.toString();
    }
  }

  set publisher(value: string | null) {
    if (value === null) {
      this.unset("publisher");
    } else {
      this.set("publisher", Value.fromString(value as string));
    }
  }

  get factory(): string | null {
    let value = this.get("factory");
    if (value === null) {
      return null;
    } else {
      return value.toString();
    }
  }

  set factory(value: string | null) {
    if (value === null) {
      this.unset("factory");
    } else {
      this.set("factory", Value.fromString(value as string));
    }
  }

  get paymentTokens(): Array<string> | null {
    let value = this.get("paymentTokens");
    if (value === null) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set paymentTokens(value: Array<string> | null) {
    if (value === null) {
      this.unset("paymentTokens");
    } else {
      this.set("paymentTokens", Value.fromStringArray(value as Array<string>));
    }
  }

  get acceptedValues(): Array<BigInt> | null {
    let value = this.get("acceptedValues");
    if (value === null) {
      return null;
    } else {
      return value.toBigIntArray();
    }
  }

  set acceptedValues(value: Array<BigInt> | null) {
    if (value === null) {
      this.unset("acceptedValues");
    } else {
      this.set("acceptedValues", Value.fromBigIntArray(value as Array<BigInt>));
    }
  }

  get publisherNonce(): BigInt | null {
    let value = this.get("publisherNonce");
    if (value === null) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set publisherNonce(value: BigInt | null) {
    if (value === null) {
      this.unset("publisherNonce");
    } else {
      this.set("publisherNonce", Value.fromBigInt(value as BigInt));
    }
  }
}

export class User extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save User entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save User entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("User", id.toString(), this);
  }

  static load(id: string): User | null {
    return store.get("User", id) as User | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get contract(): string | null {
    let value = this.get("contract");
    if (value === null) {
      return null;
    } else {
      return value.toString();
    }
  }

  set contract(value: string | null) {
    if (value === null) {
      this.unset("contract");
    } else {
      this.set("contract", Value.fromString(value as string));
    }
  }
}

export class SubscriptionObj extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save SubscriptionObj entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save SubscriptionObj entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("SubscriptionObj", id.toString(), this);
  }

  static load(id: string): SubscriptionObj | null {
    return store.get("SubscriptionObj", id) as SubscriptionObj | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get subscriber(): string {
    let value = this.get("subscriber");
    return value.toString();
  }

  set subscriber(value: string) {
    this.set("subscriber", Value.fromString(value));
  }

  get contract(): string {
    let value = this.get("contract");
    return value.toString();
  }

  set contract(value: string) {
    this.set("contract", Value.fromString(value));
  }

  get status(): string {
    let value = this.get("status");
    return value.toString();
  }

  set status(value: string) {
    this.set("status", Value.fromString(value));
  }

  get value(): BigInt {
    let value = this.get("value");
    return value.toBigInt();
  }

  set value(value: BigInt) {
    this.set("value", Value.fromBigInt(value));
  }

  get paymentToken(): string {
    let value = this.get("paymentToken");
    return value.toString();
  }

  set paymentToken(value: string) {
    this.set("paymentToken", Value.fromString(value));
  }

  get subNum(): BigInt {
    let value = this.get("subNum");
    return value.toBigInt();
  }

  set subNum(value: BigInt) {
    this.set("subNum", Value.fromBigInt(value));
  }

  get hash(): Bytes {
    let value = this.get("hash");
    return value.toBytes();
  }

  set hash(value: Bytes) {
    this.set("hash", Value.fromBytes(value));
  }

  get signedHash(): Bytes {
    let value = this.get("signedHash");
    return value.toBytes();
  }

  set signedHash(value: Bytes) {
    this.set("signedHash", Value.fromBytes(value));
  }

  get nextWithdraw(): BigInt {
    let value = this.get("nextWithdraw");
    return value.toBigInt();
  }

  set nextWithdraw(value: BigInt) {
    this.set("nextWithdraw", Value.fromBigInt(value));
  }

  get nonce(): BigInt {
    let value = this.get("nonce");
    return value.toBigInt();
  }

  set nonce(value: BigInt) {
    this.set("nonce", Value.fromBigInt(value));
  }
}
