package project.kimjinbo.RMS.sampleData;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import project.kimjinbo.RMS.RMSApplicationTests;
import project.kimjinbo.RMS.model.entity.Item;
import project.kimjinbo.RMS.repository.ItemRepository;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;


public class ItemTempSample extends RMSApplicationTests {

    @Autowired
    ItemRepository itemRepository;

    @Test
    public void createSample() {

        LocalDate date = LocalDate.now();
        LocalDate expireDate = date.plusYears(1);
        List<String> category01  = Arrays.asList("HW","HW","HW","HW","HW","HW", "SW","SW","SW","SW","SW","SW","SW","SW" );
        List<String> category02  = Arrays.asList("컴퓨터","노트북","케이블","케이블","가구","가구", "OS","OS","OS","디자인","디자인","MS","MS","MS");
        List<String> category03  = Arrays.asList("데스크탑","노트북","C타입","HDMI","책상","의자", "linux","mac","windows","포토샵","일러스트","워드","엑셀","파워포인트");
        List<Integer> itemState  = Arrays.asList( 20,20,20,20,20,10, 20,20,20,20,20,20,20,20 );
        List<Integer> rentalState= Arrays.asList( 13,13,13,11,11,13, 11,11,11,20,10,10,10,10 );

        for(int i = 0; i < category01.size(); i++){

            Item item = Item.builder()
                    .superCate(category01.get(i))
                    .subCateFirst(category02.get(i))
                    .subCateSecond(category03.get(i))
                    .name(category03.get(i))
                    .expireDate(expireDate)
                    .registerDate( date )
                    .registerUser( 0L )
                    .updateDate( date )
                    .updateUser( 0L )
                    .itemState(itemState.get(i))
                    .rentalState(rentalState.get(i))
                    .build();

            System.out.println("item : "+item);

            itemRepository.save(item);
        }

        System.out.println("test done!");
    }

}
