from django.http import HttpResponse
from django.shortcuts import render, redirect


# Create your views here.

def main(request):
    return redirect("discover")


def discover(request):
    return render(request, 'discover.html')


from django.shortcuts import render

