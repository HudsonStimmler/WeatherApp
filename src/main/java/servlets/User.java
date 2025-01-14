package servlets;

public class User{
    public int user_id;
    public String username;
    public String password;

    public User(int user_id, String username, String password){
        this.user_id = user_id;
        this.username = username;
        this.password = password;
    }

    public int getUserId(){
        return this.user_id;
    }

    public String getUsername(){
        return this.username;
    }

    public String getPassword(){
        return this.password;
    }
}
