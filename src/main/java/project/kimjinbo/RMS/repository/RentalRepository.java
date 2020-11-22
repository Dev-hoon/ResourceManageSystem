package project.kimjinbo.RMS.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import project.kimjinbo.RMS.model.entity.Rental;
import project.kimjinbo.RMS.model.entity.RentalPK;

@Repository
public interface RentalRepository extends JpaRepository<Rental, RentalPK>, JpaSpecificationExecutor<Rental> {

}
