import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { CreateToolDto } from "../dto/create-tool.dto";

@Injectable()
export class CreateToolPipe implements PipeTransform {
  transform(value: CreateToolDto, metadata: ArgumentMetadata) {
    value.price = +value.price;
    value.baseQuantity = +value.baseQuantity;
    return value;
}
}
