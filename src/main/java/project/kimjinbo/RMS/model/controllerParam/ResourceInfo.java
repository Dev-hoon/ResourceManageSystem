package project.kimjinbo.RMS.model.controllerParam;


enum RenterState{
    onRental("대여 중"),
    enable("대여 가능"),
    disable("대여 불가능");

    RenterState(String s) {
    }
}


public class ResourceInfo {

    private Long    id;
    private String  name;
    private String  lenderName;
    private int     rentalState;
    private int     category00;

    public ResourceInfo(Long id, String name, int category00) {
        this.id = id;
        this.name = name;
        this.category00 = category00;

        this.lenderName = "";
        this.rentalState = 0;
    }
    public ResourceInfo(Long id, String name, int category00, int rentalState) {
        this.id = id;
        this.name = name;
        this.category00 = category00;

        this.lenderName = "-";
        this.rentalState = rentalState;
    }
    public ResourceInfo(Long id, String name, int category00, String lenderName) {
        this.id = id;
        this.name = name;
        this.category00 = category00;

        this.lenderName = lenderName;
        this.rentalState = 2;
    }

    public Long     getId() {
        return id;
    }
    public String   getName() {
        return name;
    }
    public String   getLenderName() { return lenderName; }
    public int      getRentalState() { return rentalState; }

    public void     setRentalState(int state) { rentalState = state; }
    public void     setLenderName(String lender) { lenderName = lender; }
}