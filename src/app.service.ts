import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  
  verificaPagina(pagina: number, limite: number) {
    if (!pagina) pagina = 1;
    if (!limite) limite = 10;
    if (pagina < 1) pagina = 1;
    if (limite < 1) limite = 10;
    return [pagina, limite];
  }

  verificaLimite(pagina: number, limite: number, total: number) {
    if ((pagina - 1) * limite >= total) pagina = Math.ceil(total / limite);
    return [pagina, limite];
  }

  simplificaObjeto(objeto: string, ){
    function flattenObject(obj: any) {
        var tempObj = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                const value = obj[key];
                if (typeof value === 'object' && value !== null) {
                    if (key === '_attributes'){
                        if (value['enc:arraySize']) {
                            tempObj = [];
                            if (obj.item && obj.item.length > 0)
                                for (const item of obj.item)
                                    (tempObj as Array<any>).push(flattenObject(item));
                        } else {
                            continue;
                        }
                    }
                    if (value._text) {
                        tempObj[key] = value._text;
                    } else {
                        tempObj[key] = flattenObject(value);
                    }
                } else {
                    tempObj[key] = value;
                }
            }
        }
        return tempObj;
    }
    return flattenObject(objeto);
  }
}
