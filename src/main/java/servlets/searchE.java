package servlets;

public class searchE {
    public String searchTerm;
    public String type;
    public String timestamp;

    public searchE(String searchTerm, String type, String timestamp) {
        this.searchTerm = searchTerm;
        this.type = type;
        this.timestamp = timestamp;
    }

    public String getSearchTerm() {
        return searchTerm;
    }

    public String getType() {
        return type;
    }

    public String getTimestamp() {
        return timestamp;
    }
}
