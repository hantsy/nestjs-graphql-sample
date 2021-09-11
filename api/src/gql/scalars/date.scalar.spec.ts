import { Test, TestingModule } from '@nestjs/testing';
import { DateScalar } from './date.scalar';
import { Kind, IntValueNode} from 'graphql';

describe('DateScalar', () => {
  let dateScalar: DateScalar;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DateScalar],
    }).compile();

    dateScalar = module.get<DateScalar>(DateScalar);
  });

  it('DateScalar is defined', async () => {
    expect(dateScalar).toBeDefined();
  });

  it('parseValue', async () => {
      const date = new Date();
      const dateNumber= date.getTime();
      console.log( "date in nubmer: %d " , dateNumber);
       
      const parsedDate= dateScalar.parseValue(dateNumber)
      expect(parsedDate).toEqual(date);
  });

  it('serialize', async () => {
    const date = new Date();
    const dateNumber= date.getTime();
    console.log( "date in nubmer: %d " , dateNumber);
     
    const searilizedDate= dateScalar.serialize(date)
    expect(searilizedDate).toEqual(dateNumber);
  });

  it('parseLiteral', async () => {
    const date = new Date();
    const dateIsoString = date.toISOString();
    console.log( "date in ISO string: %s " , dateIsoString);

    const astNode =  {kind: Kind.INT, value: dateIsoString} as IntValueNode;
    const parsedDate= dateScalar.parseLiteral(astNode);

    expect(parsedDate).toEqual(date);
  });
});
