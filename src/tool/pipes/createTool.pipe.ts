import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { CreateToolDTO } from "../dto/create-tool.dto";

@Injectable()
export class CreateToolPipe implements PipeTransform {
  transform(value: CreateToolDTO, metadata: ArgumentMetadata) {
    value.price = +value.price;
    value.baseQuantity = +value.baseQuantity;
    return value;
}
}