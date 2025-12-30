package com.poly;

import javax.persistence.Column;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "person")
public class Person {
    @Id
    @Column(name = "id", columnDefinition = "INT") 
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;
    @Column(name = "Age")
    private int age;
    @Column(name = "Name")
    private String name;
    public Person() {
    }

    public Person(int age, int id, String name) {
    this.age = age;
    this.id = id;
    this.name = name;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    
    public int getId() {
        return id;
    }
    
    public void setId(int id) {
        this.id = id;
    }
    
    public int getAge() {
        return age;
    }
    
    public void setAge(int age) {
        this.age = age;
    }

	
}
