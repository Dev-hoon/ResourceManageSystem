package project.kimjinbo.RMS.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import project.kimjinbo.RMS.model.entity.ItemTemp;

@Repository
public interface ItemTempRepository extends JpaRepository<ItemTemp, Long>, JpaSpecificationExecutor<ItemTemp> {

}
